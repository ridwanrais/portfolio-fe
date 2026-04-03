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
  },
  {
    slug: "high-throughput-ticket-generation",
    title: "Asynchronous Ticket Generation Engine",
    shortDescription: "Architected a Kafka-driven system to handle mass ticket generation asynchronously, ensuring low-latency event creation for organizers.",
    problem: "When organizers create events with thousands of tickets, generating those records synchronously in the main API flow caused connection timeouts and degraded performance. Massively generating 10,000+ unique ticket records on-the-fly would block the event manager service, leading to a poor experience for major event launches.",
    architecture: "Leveraged Kafka to decouple ticket definition from physical record generation. An 'event.created' message triggers a consumer group that processes generation in controlled batches. This architecture allows the event creation API to return instantly while the heavy database write operations are handled by a dedicated background worker pool.",
    architectureDiagram: `
     [ Event Manager ] -- (Produce) --> [ Kafka: generate-tickets ]
                                              |
      +---------------------------------------+
      |                   |                   |
      v                   v                   v
[ Ticket Worker 1 ] [ Ticket Worker 2 ] [ Ticket Worker N ]
      |                   |                   |
      +---------+---------+---------+---------+
                |                   |
        [ MongoDB Session ]   [ Transaction Log ]
    `,
    techStack: ["Node.js (NestJS)", "Kafka", "MongoDB", "Mongoose", "Docker", "GCP Cloud Run"],
    keyDecisions: [
      "Utilized MongoDB transactions for each batch to ensure atomicity—either the entire batch of tickets is generated or none at all, preventing partial data corruption.",
      "Implemented a manual heartbeat() signal within the generation loop to inform Kafka the consumer is still alive during long-running batch inserts, preventing unnecessary group rebalances.",
      "Adopted an idempotent 'check-before-write' strategy at the start of the consumer handler to safely handle retries from the Kafka broker without over-generating tickets."
    ],
    tradeoffs: [
      "Accepted eventual consistency: Organizers see a 'Generating...' status while the background workers complete the task, trading off immediate availability for system stability.",
      "Balanced batch size vs. locked resources: Larger batches reduce I/O overhead but increase transaction lock duration on the MongoDB collection."
    ],
    challenges: [
      "Kafka Rebalance issues: Long-running generation loops were triggering Kafka rebalances before completion. Solved by integrating a heartbeat mechanism inside the processing loop to keep the consumer active.",
      "Ensuring no over-generation: Multiple consumers picking up the same message due to broker failure could lead to duplicate ticket definitions. Implemented a robust pre-generation check to calculate the exact remaining capacity of the current ticket set."
    ],
    scalingConsiderations: "Horizontal scaling of consumer groups allowed us to handle multiple large-scale event launches simultaneously. The worker pool is dynamically adjusted based on the consumer lag metric from the Kafka partition.",
    failureScenarios: [
      "Broker Failure: Kafka's log-append model ensures messages are persisted and retried until the generation is acknowledged as successful.",
      "DB Write Failure: Batch inserts are wrapped in transactions; if the DB fails midway, the entire batch is rolled back and retried by the consumer.",
      "Network Jitter: The heartbeat() mechanism ensures that transient network spikes between the worker and Kafka don't cause the worker to be evicted from the consumer group."
    ],
    impact: "Reduced median event creation latency from 15s+ for large events to <200ms. Allowed the platform to handle 50k+ ticket generations per minute across concurrent event launches.",
    databaseDesign: "Used an index-heavy MongoDB collection for tickets, optimized for range queries. Mapped ticketDefinitionId to individual ticket records for fast lookups during the high-load ticket purchase flow.",
    codeSnippet: {
      language: "typescript",
      title: "Batch ticket generation with Kafka heartbeats and sessions",
      code: `async (payload: Payload, heartbeat: () => Promise<void>) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    // 1. Check for existing generation to ensure idempotency
    const currentCount = await ticketModel.countDocuments({ definitionId });
    const remaining = payload.totalCapacity - currentCount;
    
    // 2. Perform batched generation to optimize DB writes
    for (let i = 0; i < payload.batchSize; i += BATCH_LIMIT) {
      const tickets = Array.from({ length: BATCH_LIMIT }, () => ({
        definition: definitionId,
        event: eventId
      }));
      
      await ticketModel.insertMany(tickets, { session });
      
      // 3. Inform Kafka we are still processing to avoid rebalance
      await heartbeat();
    }
    
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err; // Trigger Kafka retry
  } finally {
    session.endSession();
  }
}`
    }
  },
];
