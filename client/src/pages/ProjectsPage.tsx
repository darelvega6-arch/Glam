import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Code2, Home, Plus, Grid3x3, List } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface ProjectsPageProps {
  onBack: () => void;
  onEditProject: () => void;
}

export default function ProjectsPage({ onBack, onEditProject }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const projects = [
    { id: 1, name: "Mi Primer Sitio", lastModified: "hace 2 horas", linesOfCode: 42 },
    { id: 2, name: "Portfolio Personal", lastModified: "hace 1 día", linesOfCode: 128 },
    { id: 3, name: "Landing Page", lastModified: "hace 3 días", linesOfCode: 95 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back-home"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Mis Proyectos</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
              className="h-7 w-7"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
              className="h-7 w-7"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
          <Button
            onClick={() => console.log("New project")}
            data-testid="button-new-project"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mis Proyectos</h1>
            <p className="text-muted-foreground">
              Administra y edita tus proyectos GWL+
            </p>
          </div>
          
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                lastModified={project.lastModified}
                linesOfCode={project.linesOfCode}
                onEdit={onEditProject}
                onPreview={() => console.log("Preview", project.id)}
                onDelete={() => console.log("Delete", project.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
