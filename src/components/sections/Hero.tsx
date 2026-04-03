import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
        Backend / Fullstack Engineer
      </h1>
      <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mb-8 leading-relaxed">
        I build scalable backend systems and production-ready applications.
      </p>
      <div className="flex items-center gap-4">
        <Button asChild variant="primary">
          <a href="#case-studies">View Case Studies</a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-[var(--border)] max-w-3xl">
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Experience</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">5+ Years</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Core Stack</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">Go, Node.js, TS, PostgreSQL</p>
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Key Strengths</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">APIs, Distributed Systems, DBs</p>
        </div>
      </div>
    </section>
  );
}
