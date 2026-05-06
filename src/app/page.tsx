import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { FadeIn } from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 bg-[var(--background)]">
      <FadeIn delay={0.1}>
        <Hero />
      </FadeIn>
      <FadeIn delay={0.15}>
        <About />
      </FadeIn>
      <CaseStudies />
      <FadeIn delay={0.1}>
        <Experience />
      </FadeIn>
      <FadeIn delay={0.1}>
        <Contact />
      </FadeIn>
    </div>
  );
}
