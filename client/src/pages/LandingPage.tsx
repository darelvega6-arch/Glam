import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SyntaxShowcase from "@/components/SyntaxShowcase";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Code2, BookOpen, FolderKanban } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigateToTutorials?: () => void;
  onNavigateToProjects?: () => void;
}

export default function LandingPage({ 
  onGetStarted, 
  onNavigateToTutorials, 
  onNavigateToProjects 
}: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GlaWebLang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onNavigateToTutorials}
              data-testid="link-tutorials"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Tutoriales
            </Button>
            <Button
              variant="ghost"
              onClick={onNavigateToProjects}
              data-testid="link-projects"
            >
              <FolderKanban className="h-4 w-4 mr-2" />
              Proyectos
            </Button>
            <ThemeToggle />
            <Button
              onClick={onGetStarted}
              data-testid="button-header-start"
            >
              Empezar
            </Button>
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <SyntaxShowcase />
        
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comienza Tu Viaje en GWL+
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a la revolución del desarrollo web. Crea aplicaciones increíbles hoy mismo.
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
              data-testid="button-footer-start"
              className="text-lg px-8 py-6 h-auto"
            >
              Empezar Ahora Gratis
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2025 GlaWebLang. Un lenguaje de programación innovador.</p>
        </div>
      </footer>
    </div>
  );
}
