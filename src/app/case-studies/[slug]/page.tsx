import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { Badge } from "@/components/ui/Badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FadeIn } from "@/components/ui/FadeIn";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <article className="py-20 px-6 max-w-3xl mx-auto min-h-screen">
      <FadeIn delay={0.05} direction="right">
        <Link
          href="/#case-studies"
          className="inline-flex items-center text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>
      </FadeIn>

      <div className="space-y-4 mb-16">
        <FadeIn delay={0.1}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            {study.title}
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
            {study.shortDescription}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap gap-2 pt-4">
            {study.techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="space-y-16">
        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">01.</span>
              Problem Statement
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              {study.problem}
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">02.</span>
              Architecture Overview
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
              {study.architecture}
            </p>
            <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[#1e1e1e] p-6 text-[var(--muted-foreground)] text-sm font-mono shadow-sm">
              <pre className="text-zinc-300 leading-tight">
                {study.architectureDiagram}
              </pre>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">03.</span>
              Database Design
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
              {study.databaseDesign}
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">04.</span>
              Key Decisions & Tradeoffs
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3 p-6 rounded-xl bg-[var(--muted)]/20 border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Decisions
                </h3>
                <ul className="space-y-2 pl-6">
                  {study.keyDecisions.map((decision, i) => (
                    <li key={i} className="text-[var(--muted-foreground)] list-disc text-sm leading-relaxed">
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3 p-6 rounded-xl bg-[var(--muted)]/20 border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Tradeoffs
                </h3>
                <ul className="space-y-2 pl-6">
                  {study.tradeoffs.map((tradeoff, i) => (
                    <li key={i} className="text-[var(--muted-foreground)] list-disc text-sm leading-relaxed">
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">05.</span>
              Scaling Considerations
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
              {study.scalingConsiderations}
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">06.</span>
              Failure Scenarios & Mitigation
            </h2>
            <ul className="space-y-3 pl-6 mb-8">
              {study.failureScenarios.map((scenario, i) => (
                <li key={i} className="text-[var(--muted-foreground)] list-disc leading-relaxed">
                  {scenario}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">07.</span>
              Engineering Challenges
            </h2>
            <ul className="space-y-3 pl-6 mb-8">
              {study.challenges.map((challenge, i) => (
                <li key={i} className="text-[var(--muted-foreground)] list-disc leading-relaxed">
                  {challenge}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">08.</span>
              Implementation Details
            </h2>
            
            {study.implementationSubsystems && study.implementationSubsystems.length > 0 && (
              <div className="space-y-8 mt-4">
                {study.implementationSubsystems.map((subsystem, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2">{subsystem.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm mb-4 leading-relaxed">{subsystem.description}</p>
                    <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                      <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-mono text-zinc-400 border-b border-zinc-800">
                        {subsystem.language === 'rust' ? 'Rust' : 'TypeScript'}
                      </div>
                      <SyntaxHighlighter
                        language={subsystem.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "1.5rem",
                          fontSize: "0.875rem",
                          backgroundColor: "#1e1e1e",
                        }}
                      >
                        {subsystem.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
              <span className="text-[var(--muted-foreground)] opacity-50">09.</span>
              Impact & Outcome
            </h2>
            <div className="rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-4 tracking-tight text-[var(--foreground)] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Impact & Outcome
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">
                {study.impact}
              </p>
            </div>
          </section>
        </FadeIn>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}
