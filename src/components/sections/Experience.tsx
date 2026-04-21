import { Badge } from '@/components/ui/Badge';

export function Experience() {
  const experiences = [
    {
      role: 'Senior Backend Developer',
      company: 'Cigro',
      period: 'Aug 2025 - Present',
      description: 'Leading backend development for diverse client projects in the software outsourcing division. Key deliveries include scalable hiking and dating platforms, internal branch order aggregators, and AI-driven generative travel worksheet systems for children.',
      skills: ['TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'AI Integration']
    },
    {
      role: 'Back End Developer',
      company: 'EventCHI',
      period: 'Sep 2024 - Aug 2025',
      description: 'Engineering high-performance, PCI-compliant payment orchestration systems. Implementing secure data encryption flows using GCP KMS and contributing to the global open-source payment ecosystem (Hyperswitch). Architects scalable backend services using Rust and TypeScript.',
      skills: ['Rust', 'TypeScript', 'GCP KMS', 'NestJS', 'PostgreSQL', 'Kafka']
    },
    {
      role: 'Full-stack Developer',
      company: 'Moladin',
      period: 'Jan 2024 - Sep 2024',
      description: 'Built and optimized core fintech API services for a major automotive platform. Scaled internal dealer-facing tools and financial processing engines using NestJS and unified TypeScript architecture.',
      skills: ['Node.js', 'Express.js', 'TypeScript', 'NestJS', 'MongoDB', 'Redis']
    },
    {
      role: 'Back End Developer',
      company: 'Moladin',
      period: 'Apr 2023 - Dec 2023',
      description: 'Developed critical backend integrations for the business workflow automation suite. Leveraged Yellow AI and PandaDoc for real-time document processing and AI-driven automated communication flows.',
      skills: ['Node.js', 'Express.js', 'Yellow AI', 'PandaDoc', 'API Design']
    },
    {
      role: 'Software Engineer',
      company: 'OKANEMO',
      period: 'Nov 2022 - Mar 2023',
      description: 'Engineered backend components for a fintech solution, focusing on reliable data ingestion and API infrastructure consistency.',
      skills: ['Node.js', 'PostgreSQL', 'Microservices']
    },
    {
      role: 'Software Engineer',
      company: 'Refactory',
      period: 'Jul 2022 - Oct 2022',
      description: 'Delivered industrial-grade software components through rigorous backend engineering and system integration tasks.',
      skills: ['Software Engineering', 'System Integration']
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
