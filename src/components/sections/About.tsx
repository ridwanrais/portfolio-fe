export function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto scroll-m-16 border-t border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)] tracking-tight">About</h2>
      <div className="text-[var(--muted-foreground)] leading-relaxed space-y-4 max-w-3xl">
        <p>
          I build backend systems that are designed to survive real-world load—failures, spikes, and everything in between.
        </p>
        <p>
          I focus on distributed, event-driven architectures (Kafka, AWS, Terraform), with experience in fintech and payment systems.
        </p>
        <p>
          I care about systems that are simple, reliable, and predictable in production.
        </p>
      </div>
    </section>
  );
}
