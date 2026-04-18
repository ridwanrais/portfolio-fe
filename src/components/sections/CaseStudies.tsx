import Link from 'next/link';
import { caseStudies } from '@/data/case-studies';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-20 px-6 max-w-4xl mx-auto scroll-m-16 border-t border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-8 text-[var(--foreground)] tracking-tight">System Architecture / Case Studies</h2>
      <div className="grid gap-6">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group block rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all hover:border-[var(--muted-foreground)]/50 hover:bg-[var(--muted)]/30"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                  {study.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
                  {study.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {study.techStack.map(tech => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional Projects / Coming Soon */}
      <h3 className="text-lg font-semibold mt-16 mb-6 text-[var(--foreground)] opacity-70">Projects</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[var(--border)] border-dashed bg-transparent p-6 flex flex-col items-start justify-center">
          <h4 className="font-semibold mb-2">Receipt Scanner & OCR Pipeline</h4>
          <a href="https://receipt-scanner.ridwan-dev.com" target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-[var(--foreground)] mb-4 hover:text-[var(--primary)] transition-colors underline underline-offset-4 decoration-[var(--border)] hover:decoration-current">Live Demo</a>
          <span className="text-sm text-[var(--muted-foreground)] mb-4">A receipt scanning pipeline powered by an open-source Qwen model (also supports custom MLX OCR). Features analytical dashboards and historical scan tracking to help users gather deeper insights from their spending receipts.</span>
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/ridwanrais/receipt-scanner-be" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4 decoration-[var(--border)] hover:decoration-current">
              Backend Repository
            </a>
            <a href="https://github.com/ridwanrais/receipt-scanner-app" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4 decoration-[var(--border)] hover:decoration-current">
              Frontend Repository
            </a>
            <a href="https://github.com/ridwanrais/receipt-ocr-mlx" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4 decoration-[var(--border)] hover:decoration-current">
              OCR MLX Repository
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
