import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
        Ridwan Rais Firdaus
      </h1>
      <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mb-8 leading-relaxed">
        Software Engineer Specializing in High-Performance & Secure Systems
      </p>
      <div className="flex items-center gap-4">
        <Button asChild variant="primary">
          <a href="#case-studies">View Case Studies</a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://www.linkedin.com/in/ridwan-rais-firdaus-5a53a9193/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[var(--border)]">
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Experience</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">4+ Years</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Core Stack</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">Go, Node.js, Rust, Next.js</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Key Strengths</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">APIs, Distributed Systems, DBs</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium text-[var(--foreground)] text-sm uppercase tracking-wider opacity-80">Infra / DevOps</h3>
          <p className="text-[var(--muted-foreground)] font-mono text-sm leading-relaxed">Terraform, CI/CD</p>
        </div>
      </div>
    </section>
  );
}
