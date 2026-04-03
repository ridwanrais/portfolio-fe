export function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto scroll-m-16 border-t border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)] tracking-tight">About</h2>
      <div className="text-[var(--muted-foreground)] leading-relaxed space-y-4 max-w-3xl">
        <p>
          I specialize in distributed systems, API design, and cloud infrastructure. With a strong foundation in backend architecture, I aim to build resilient applications that scale horizontally.
        </p>
        <p>
          My experience revolves around performance optimization, ensuring high availability, and writing clean, maintainable code. Whether it's designing highly concurrent worker pools or real-time event-driven services, my focus is on solving complex engineering problems through system design.
        </p>
      </div>
    </section>
  );
}
