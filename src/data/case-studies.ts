export interface CaseStudy {
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  architecture: string;
  architectureDiagram: string;
  techStack: string[];
  keyDecisions: string[];
  tradeoffs: string[];
  challenges: string[];
  scalingConsiderations: string;
  failureScenarios: string[];
  futureImprovements: string[];
  impact: string;
  databaseDesign: string;
  codeSnippet: {
    language: string;
    code: string;
    title: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "distributed-task-queue",
    title: "High-Throughput Distributed Task Queue",
    shortDescription: "Designed and implemented a Redis-backed distributed task queue processing 5k+ jobs/sec with graceful degradation.",
    problem: "As our user base grew by 400% YoY, our legacy monolithic cron architecture began to buckle under bursty workloads. Critical background jobs—such as batch email processing and report generation—were delayed by hours because the monolithic workers were starved for resources, causing cascading timeouts downstream.",
    architecture: "We decided to decouple job ingestion from execution using an event-driven microservices architecture. We leveraged Redis Streams as a high-throughput message broker, providing persistent, append-only logs. A pool of Go-based workers processes jobs concurrently using Redis consumer groups, ensuring each message is processed exactly once by the pool while remaining idempotent.",
    architectureDiagram: `
     [ API Gateway ]
           |
           v
    [ Producer Node ]   --> (Writes to) -->  [ Redis Streams ]
                                                  |
     +--------------------------------------------+
     |                    |                       |
     v                    v                       v
[ Go Worker 1 ]    [ Go Worker 2 ]  ...    [ Go Worker N ]
     |                    |                       |
     +--------------------+-----------------------+
                          |
                          v
                   [ PostgreSQL DB ] (State & Metrics)
    `,
    techStack: ["Go", "Redis Streams", "PostgreSQL", "Docker", "AWS ECS", "KEDA"],
    keyDecisions: [
      "Chose Redis Streams over SQS or Kafka because of the requirement for sub-millisecond latency, built-in consumer group support, and operational simplicity (we already heavily used Redis).",
      "Implemented a custom dead-letter queue (DLQ) with an exponential backoff jitter strategy for transient failure recovery.",
      "Used Go for the worker services to take advantage of lightweight goroutines, minimizing memory overhead during massive concurrency."
    ],
    tradeoffs: [
      "Accepted at-least-once delivery semantics to maximize ingestion throughput. We forced all consumer logic to be strictly idempotent, which added complexity to the application layer.",
      "Opted for an in-memory queue broker (Redis), which constrained the maximum backlog size to available RAM. We mitigated this by setting aggressive retention policies and aggressive auto-scaling."
    ],
    challenges: [
      "Managing memory spikes during massive payload processing. We mitigated this by implementing strict payload size limits and parsing large JSON bodies via streams.",
      "Dealing with worker starvation during sudden traffic spikes. Solved by implementing KEDA for Kubernetes/ECS event-driven autoscaling based on queue lag metrics."
    ],
    scalingConsiderations: "The system scales horizontally on two axes: the Redis cluster can be partitioned by topic/tenant, and the worker pool autoscales linearly based on the Redis Stream group backlog length. KEDA continuously polls the Redis metric and triggers new task spawns within 10 seconds of a backlog spike.",
    failureScenarios: [
      "Worker OOM or Crash: Redis consumer group 'pending' entries will inevitably timeout. A background sweeper routine periodically reclaims these stuck jobs using XCLAIM and reassigns them.",
      "Redis Network Partition: Ingest API buffers locally up to 50MB before rejecting requests with 429 Too Many Requests to ensure no silent data dropping.",
      "Database High Latency: Workers implement circuit breakers for DB writes. If the DB is slow, workers pause dequeuing rather than crashing."
    ],
    futureImprovements: [
      "Migrate historical long-term job metadata from PostgreSQL to a cheaper cold storage like S3/Athena for analytics.",
      "Implement predictive scaling models using historical traffic patterns instead of purely reactive lag-based scaling."
    ],
    impact: "Reduced median job execution latency by 92% and completely eliminated the cron backlog. The system scaled flawlessly to 15,000+ jobs/second during the Black Friday peak without needing any manual intervention or scaling.",
    databaseDesign: "PostgreSQL acts as the persistent truth for job lifecycle states (Queued, Processing, Completed, Failed). We utilize a partitioned table strategy based on the 'created_at' timestamp to keep index sizes manageable. We extensively use JSONB columns for flexible job payload storage without requiring schema migrations per job type.",
    codeSnippet: {
      language: "go",
      title: "Idempotent worker execution loop with XCLAIM fallback",
      code: `func (w *Worker) ProcessStream(ctx context.Context) error {
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    default:
      // Block for up to 2 seconds waiting for new messages
      streams, err := w.redis.XReadGroup(ctx, &redis.XReadGroupArgs{
        Group:    w.group,
        Consumer: w.id,
        Streams:  []string{w.stream, ">"},
        Count:    10,
        Block:    2000,
      }).Result()
      
      if err != nil && err != redis.Nil {
        w.logger.Error("Failed to read from stream", err)
        continue
      }
      
      for _, msg := range streams[0].Messages {
        // executeJob ensures idempotency using a DB unique constraint
        if err := w.executeJob(ctx, msg); err == nil {
          // Acknowledge only on successful processing
          w.redis.XAck(ctx, w.stream, w.group, msg.ID)
        } else {
          w.handleFailure(ctx, msg, err)
        }
      }
    }
  }
}`
    }
  },
  {
    slug: "realtime-collaboration-api",
    title: "Real-time Collaboration Engine",
    shortDescription: "Constructed a WebSockets-based synchronization kernel powering a highly concurrent collaborative document editor.",
    problem: "Our flagship product required a Google Docs-style rich text editor. Initial implementations using Operational Transformation (OT) were brittle—users were experiencing cursor desyncs, 'ghost edits', and fatal conflicted states when typing from slow cellular networks.",
    architecture: "Instead of OT, we pivoted to Conflict-free Replicated Data Types (CRDTs). We built a Node.js WebSocket backend that orchestrates document state via Yjs. Because WebSockets dictate stateful connections, we utilized a Redis Pub/Sub mesh to broadcast state deltas across horizontally scaled container instances. Document snapshots are asynchronously compacted and saved to MongoDB.",
    architectureDiagram: `
       [ Client A ]      [ Client B ]      [ Client C ]
            |                 |                 |
     (WebSockets)      (WebSockets)      (WebSockets)
            |                 |                 |
     [ Node WS 1 ]     [ Node WS 2 ]     [ Node WS 1 ]
            |                 |                 |
            +-------+---------+--------+--------+
                    |                  |
            [ Redis Pub/Sub ]   [ MongoDB (Snapshots) ]
    `,
    techStack: ["Node.js", "WebSockets", "Yjs (CRDT)", "MongoDB", "Redis Pub/Sub", "Prometheus"],
    keyDecisions: [
      "Chose Yjs and CRDTs over Operational Transformation (OT) to eliminate the need for a central, strictly ordered resolution server. It allows true peer-to-peer eventual consistency.",
      "Utilized Redis Pub/Sub to sync document state changes across cluster nodes so clients connecting to different containers still see each other's cursor movements in real-time.",
      "Separated the real-time ephemeral sync layer from the persistent storage layer. MongoDB only handles compacted document snapshots, saving heavy write ops."
    ],
    tradeoffs: [
      "CRDT metadata progressively increases the document payload size compared to standard plaintext. We mitigated this by requiring clients to periodically perform garbage collection and snapshot compaction.",
      "Node.js was chosen for its excellent async I/O handling with WebSockets, trading off the CPU raw performance we might have had with Rust or Go."
    ],
    challenges: [
      "Handling WebSocket connection drops on mobile devices seamlessly. We implemented a robust reconnection synchronization protocol that requests only Missed State Vectors instead of the full document upon reconnect.",
      "Memory bloat on Node servers when keeping thousands of Yjs documents in memory. Solved via an LRU cache implementation that unloads dormant documents to MongoDB."
    ],
    scalingConsiderations: "The WebSocket servers are stateless regarding the single source of truth—they can be horizontally scaled infinitely behind an ALB. The primary bottleneck becomes the Redis Pub/Sub fanout. For extreme scale, we plan to partition Redis channels by document ID hashes.",
    failureScenarios: [
      "Redis Failure: If Pub/Sub goes down, cross-container sync stops. The load balancer is configured with sticky sessions to temporarily keep users of the same doc on the same container to mitigate impact.",
      "MongoDB Outage: The in-memory Yjs documents act as a buffer. The system can survive DB downtime by queueing snapshots locally until the DB recovers, provided it doesn't OOM.",
      "Network Partition: The beauty of CRDTs is that disconnected clients can continue editing locally. Upon network restore, their local changes will deterministically merge without conflict."
    ],
    futureImprovements: [
      "Implement a Rust-powered WebAssembly client to speed up local CRDT resolution for massive documents.",
      "Move the Redis Pub/Sub mesh to a more robust message bus like NATS JetStream for reliable delivery guarantees."
    ],
    impact: "Successfully scaled to support over 10,000 concurrent editing sessions and up to 100 simultaneous users in a single document with zero perceived latency. Eliminated conflict resolution support tickets entirely.",
    databaseDesign: "MongoDB is used as a document store. The schema simply pairs a specific 'documentId' with an opaque binary blob (Uint8Array) representing the compacted Yjs state. This avoids mapping rich text to complex relational tables, moving all merging logic out of the database and into the application layer.",
    codeSnippet: {
      language: "typescript",
      title: "Broadcasting CRDT deltas across the Redis mesh",
      code: `import * as Y from 'yjs';
import { Redis } from 'ioredis';

class DocumentRoom {
  private ydoc = new Y.Doc();
  
  constructor(private docId: string, private redis: Redis) {
    // Subscribe to updates from other instances
    this.redis.subscribe(\`doc:\${docId}\`);
    this.redis.on('message', (channel, message) => {
      // Apply remote deltas deterministically
      const update = Buffer.from(message, 'base64');
      Y.applyUpdate(this.ydoc, update);
    });
    
    // Broadcast local changes to the Redis mesh
    this.ydoc.on('update', (update: Uint8Array) => {
      const base64Update = Buffer.from(update).toString('base64');
      this.redis.publish(\`doc:\${docId}\`, base64Update);
    });
  }
}`
    }
  }
];
