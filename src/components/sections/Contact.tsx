import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto border-t border-[var(--border)] text-center">
      <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)] tracking-tight">Let's Connect</h2>
      <p className="text-[var(--muted-foreground)] leading-relaxed mb-8 max-w-md mx-auto">
        I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </p>
      <div className="flex flex-wrap justify-center items-center gap-4">
        <Button asChild variant="primary">
          <a href="mailto:ridwan.rais2@gmail.com">
            <Mail className="w-4 h-4 mr-2" />
            Email Me
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://github.com/ridwanrais" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://www.linkedin.com/in/ridwan-rais-firdaus-5a53a9193/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </Button>
      </div>
    </section>
  );
}
