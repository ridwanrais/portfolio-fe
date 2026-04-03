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
    techStack: ["Go", "Redis Streams", "PostgreSQL", "Docker", "GCP Cloud Run", "KEDA"],
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
    slug: "secure-payment-gateway",
    title: "Self-Hosted Payment Gateway (PCI DSS & GDPR)",
    shortDescription: "Architected a highly secure, self-hosted payment orchestrator to maintain data sovereignty and multi-processor routing.",
    problem: "Initially, our platform was entirely dependent on Stripe, which offered limited merchant support outside of Western markets. This prevented us from expanding into high-growth regions like Indonesia where Stripe's local acceptance was poor. To scale globally, we needed to move away from vendor-specific hosted fields and implement our own orchestration layer that could route to multiple local PSPs (like Xendit) while maintaining a single, secure source of truth for card data.",
    architecture: "The solution was built around a centralized, self-hosted Card Vault that tokenizes cardholder data independently of any specific payment provider. This architectural decoupling allows us to 'vault once' and then dynamically route transactions to the most effective local processor—routing Indonesian payments through Xendit's rails while maintaining Stripe for Western transactions—all without the customer ever re-entering their data or the platform's core databases ever seeing a raw PAN.",
    architectureDiagram: `
     [ Client Devices ] ---> (PCI Scope)
             |
             v
    [ API Gateway (WAF) ]
             |
             v
   [ Chi Backend Core ]  --> [ Payment Orchestrator ]
             |                      |
             v                      v
   [ Encryption Svc ]      [ Card Vault (Rust) ]
          (Rust)                    |
                                    v
                           [ Isolated Vault DB ]
    `,
    techStack: ["Node.js (NestJS)", "Rust", "Payment Orchestration", "PostgreSQL", "Redis", "GCP KMS"],
    keyDecisions: [
      "Opted to self-host the orchestration layer's Card Vault within a physically isolated VPC subnet with zero outbound internet access, minimizing the blast radius of any potential compromise.",
      "Integrated a Rust-built Encryption Service utilizing AES-256-GCM via GCP KMS keys to proactively encrypt PII payloads. I personally contributed to the Hyperswitch open-source ecosystem by implementing the GCP KMS encryption provider.",
      "Expanded the orchestrator's capability to support local Southeast Asian markets; I authored and upstreamed the Xendit payment processor integration to the core routing engine.",
      "Used a strictly decoupled multi-database pattern. The primary operational DB stores only opaque transaction references, while the secure Vault DB handles cryptographic PAN mappings."
    ],
    tradeoffs: [
      "Shouldered the immense compliance burden of an in-house PCI DSS Level 1 audit instead of delegating entirely to Stripe Elements, forcing strict CI/CD and infrastructural auditing.",
      "Increased local developmental friction. Replicating the production environment requires developers to run 5 heavy services (Vault, Router, Encryption, multiple DBs) locally."
    ],
    challenges: [
      "Ensuring exactly-once payment execution. We implemented a unified idempotency layer that protects users from being double-charged during network jitters or upstream PSP timeouts, regardless of which local processor the payment is routed to.",
      "Proactive PII/Card data leakage prevention. We architected a high-performance regex-based middleware that proactively sanitizes all outgoing logs across the distributed system, preventing sensitive data from ever reaching our ELK stack.",
      "Latency budgets: Routing, encrypting, tokenizing, and communicating with upstream PSPs had to execute under 1000ms to prevent checkout abandonment."
    ],
    scalingConsiderations: "The stateless encryption and routing tier scales horizontally on Kubernetes based solely on CPU metrics. The Card Vault relies on heavily tuned PgBouncer instances for multiplexed connection pooling to PostgreSQL to handle high concurrent token exchanges during sales spikes.",
    failureScenarios: [
      "Vault DB Failure: Automatic failover to a synchronous Hot Standby replica within 5 seconds. Checkout API handlers employ exponential backoff if they receive 503s.",
      "Encryption Service Down: PII-sensitive endpoints immediately hard-fail, rejecting new payment methods to strictly avoid writing unencrypted data to temporary memory or logs.",
      "Upstream PSP Outage: The payment router utilizes volume-based circuit breakers. If Stripe errors consistently, traffic is instantly redistributed to Adyen or Braintree."
    ],
    impact: "Successfully diverted 100% of payment volume across multiple processors, achieving full self-hosted PCI DSS compliance and reducing vendor fees.",
    databaseDesign: "The main operational database structure is agnostic to payment info. A completely air-gapped PostgreSQL instance is tightly bound to the Card Vault. PANs are encrypted at rest. We utilize deterministic AES encryption so that Card Fingerprints can be queried to prevent duplicate card additions without decrypting the payload.",
    codeSnippet: {
      language: "typescript",
      title: "Executing secure payment routing via orchestrator SDK",
      code: `import { Injectable } from '@nestjs/common';
import { PaymentOrchestratorClient } from '@payments/api';
import { EncryptionService } from './encryption.service';

@Injectable()
export class PaymentService {
  constructor(
    private orchestrator: PaymentOrchestratorClient,
    private encryptionSvc: EncryptionService
  ) {}

  async processPayment(orderId: string, customerData: SensitiveData) {
    // 1. Encrypt PII before it hits any DB or external logging
    const encryptedCustomer = await this.encryptionSvc.encrypt(customerData);
    
    // 2. Instruct orchestrator to vault and route the payment
    const paymentIntent = await this.orchestrator.payments.create({
      amount: 15000, 
      currency: 'USD',
      customer_id: encryptedCustomer.referenceId,
      routing_algorithm: {
        type: "cost_optimized",
        fallback: ["stripe", "braintree"]
      },
      capture_method: "automatic"
    });

    return paymentIntent.client_secret;
  }
}`
    }
  }
];
