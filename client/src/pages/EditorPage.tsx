import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import { interpretGWL, exampleGWLCode } from "@/lib/gwl-interpreter";
import { Button } from "@/components/ui/button";
import { Code2, Home, Save, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

interface EditorPageProps {
  onBack: () => void;
  projectId?: string;
}

export default function EditorPage({ onBack, projectId }: EditorPageProps) {
  const { toast } = useToast();
  const [code, setCode] = useState(exampleGWLCode);
  const [output, setOutput] = useState(() => interpretGWL(exampleGWLCode));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedCode: string) => {
      if (!projectId) {
        throw new Error("No project ID");
      }
      const res = await apiRequest('PATCH', `/api/projects/${projectId}`, { code: updatedCode });
      return await res.json() as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      setHasUnsavedChanges(false);
      toast({
        title: "Guardado",
        description: "Tus cambios se han guardado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (project && project.code) {
      setCode(project.code);
      setOutput(interpretGWL(project.code));
      setHasUnsavedChanges(false);
    }
  }, [project]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  };

  const handleRun = (codeToRun: string) => {
    const result = interpretGWL(codeToRun);
    setOutput(result);
  };

  const handleSave = () => {
    if (projectId) {
      saveMutation.mutate(code);
    } else {
      toast({
        title: "Guardado local",
        description: "Los cambios se mantienen en esta sesión",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
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
            <span className="text-xl font-bold">GlaWebLang Editor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {project?.name || "Proyecto sin guardar"}
            {hasUnsavedChanges && " (modificado)"}
          </span>
          {projectId && (
            <Button
              variant={hasUnsavedChanges ? "default" : "ghost"}
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending || !hasUnsavedChanges}
              data-testid="button-save-project"
            >
              {saveMutation.isPending ? (
                <>Guardando...</>
              ) : hasUnsavedChanges ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardado
                </>
              )}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="h-full border-r overflow-auto">
          <CodeEditor
            initialCode={code}
            onCodeChange={handleCodeChange}
            onRun={handleRun}
          />
        </div>
        
        <div className="h-full overflow-auto">
          <PreviewPanel
            html={output.html}
            css={output.css}
            errors={output.errors}
          />
        </div>
      </div>
    </div>
  );
}
