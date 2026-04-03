import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 bg-[var(--background)]">
      <Hero />
      <About />
      <CaseStudies />
      <Experience />
      <Contact />
    </div>
  );
}
