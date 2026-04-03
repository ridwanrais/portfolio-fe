import { Badge } from '@/components/ui/Badge';

export function Experience() {
  const experiences = [
    {
      role: 'Senior Backend Engineer',
      company: 'High-growth Fintech Startup',
      period: '2023 - Present',
      description: 'Led the migration of a monolithic payment processing system to a microservices architecture. Designed idempotent APIs ensuring robust transaction handling under high concurrency.',
      skills: ['Go', 'PostgreSQL', 'Kafka', 'Kubernetes']
    },
    {
      role: 'Fullstack Engineer',
      company: 'Enterprise SaaS Provider',
      period: '2020 - 2023',
      description: 'Optimized legacy database queries resulting in a 40% reduction in average API latency. Built real-time synchronization services for offline-first mobile clients.',
      skills: ['Node.js', 'Typescript', 'Redis', 'GCP']
    }
  ];

  return (
    <section id="experience" className="py-20 px-6 max-w-4xl mx-auto scroll-m-16 border-t border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-8 text-[var(--foreground)] tracking-tight">Experience</h2>
      <div className="space-y-12">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative sm:pl-8">
            <div className="hidden sm:block absolute left-0 top-2 h-2 w-2 rounded-full outline outline-2 outline-offset-2 outline-[var(--border)] bg-[var(--muted-foreground)]"></div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-3">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                {exp.role} <span className="font-normal text-[var(--muted-foreground)] mx-1">@</span> <span className="font-medium text-[var(--foreground)] opacity-90">{exp.company}</span>
              </h3>
              <span className="text-sm font-mono text-[var(--muted-foreground)] shrink-0">{exp.period}</span>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4 max-w-2xl">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map(skill => <Badge key={skill}>{skill}</Badge>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
