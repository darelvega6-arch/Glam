import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Code2, Home, Plus, Grid3x3, List } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectsPageProps {
  onBack: () => void;
  onEditProject: (projectId: string) => void;
}

export default function ProjectsPage({ onBack, onEditProject }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { toast } = useToast();
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('POST', '/api/projects', {
        name,
        code: `// ${name}\ncomponent App():\n  render:\n    Heading("${name}")\n    Text("Comienza a programar aquí...")\nend`,
        userId: null,
      });
      return await res.json() as Project;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Proyecto creado",
        description: `${newProject.name} se ha creado exitosamente`,
      });
      setShowNewDialog(false);
      setNewProjectName("");
      onEditProject(newProject.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createMutation.mutate(newProjectName);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "recientemente";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "ahora mismo";
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} horas`;
    if (diffDays < 7) return `hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

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
            onClick={() => setShowNewDialog(true)}
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
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando proyectos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay proyectos aún</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primer proyecto para comenzar
              </p>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  lastModified={formatDate(null)}
                  linesOfCode={project.code.split('\n').length}
                  onEdit={() => onEditProject(project.id)}
                  onPreview={() => console.log("Preview", project.id)}
                  onDelete={() => deleteMutation.mutate(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Crea un nuevo proyecto GWL+ para comenzar a programar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Nombre del proyecto</Label>
              <Input
                id="project-name"
                placeholder="Mi Proyecto Increíble"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateProject();
                  }
                }}
                data-testid="input-project-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowNewDialog(false)}
              data-testid="button-cancel-project"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || createMutation.isPending}
              data-testid="button-create-project"
            >
              {createMutation.isPending ? "Creando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
