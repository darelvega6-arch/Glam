
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import CodeEditor from "@/components/CodeEditor";
import { interpretGWL, exampleGWLCode } from "@/lib/gwl-interpreter";
import { Button } from "@/components/ui/button";
import { Code2, Home, Save, CheckCircle2, X, Maximize2 } from "lucide-react";
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
  const [showPreview, setShowPreview] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);

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
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 500);
      toast({
        title: "✅ Guardado exitoso",
        description: "Tus cambios se han guardado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "❌ Error al guardar",
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
    setIsExecuting(true);
    setTimeout(() => {
      const result = interpretGWL(codeToRun);
      setOutput(result);
      setIsExecuting(false);
      setShowPreview(true);
    }, 300);
  };

  const handleSave = () => {
    if (projectId) {
      saveMutation.mutate(code);
    } else {
      toast({
        title: "💾 Guardado local",
        description: "Los cambios se mantienen en esta sesión",
      });
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-background z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:scale-110 transition-transform"
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
              className={`transition-all ${saveAnimation ? 'animate-pulse-success' : ''}`}
              data-testid="button-save-project"
            >
              {saveMutation.isPending ? (
                <>
                  <div className="animate-spin-slow h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Guardando...
                </>
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
      
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          initialCode={code}
          onCodeChange={handleCodeChange}
          onRun={handleRun}
          isExecuting={isExecuting}
        />
      </div>

      {/* Vista previa en pantalla completa */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-background animate-slide-in">
          <div className="h-full flex flex-col">
            <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
              <div className="flex items-center gap-3">
                <Maximize2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Vista Previa GWL+</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClosePreview}
                className="hover:scale-110 transition-transform"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {output.errors.length > 0 ? (
                <div className="animate-fade-in max-w-2xl mx-auto">
                  <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-destructive mb-4">❌ Error en el código</h3>
                    {output.errors.map((error, idx) => (
                      <p key={idx} className="text-destructive mb-2 font-mono text-sm">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; }
                            .gwl-preview { 
                              padding: 40px; 
                              text-align: center; 
                              color: #888;
                              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                              min-height: 100vh;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                            }
                            .gwl-error { 
                              padding: 30px; 
                              color: #dc2626; 
                              background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                              border-radius: 12px;
                              border: 2px solid #ef4444;
                              max-width: 600px;
                              margin: 20px auto;
                              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            }
                            .gwl-error h3 {
                              margin-bottom: 15px;
                              font-size: 20px;
                            }
                            .gwl-error p {
                              line-height: 1.6;
                            }
                            .gwl-button { 
                              padding: 12px 24px; 
                              background: hsl(262, 83%, 58%);
                              color: white; 
                              border: none; 
                              border-radius: 8px; 
                              cursor: pointer;
                              font-size: 16px;
                              transition: all 0.3s;
                            }
                            .gwl-button:hover { 
                              background: hsl(262, 83%, 50%);
                              transform: translateY(-2px);
                              box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
                            }
                            .gwl-button:active {
                              transform: translateY(0);
                            }
                            .gwl-container { padding: 20px; margin: 10px 0; }
                            .gwl-input {
                              padding: 12px;
                              border: 2px solid #ddd;
                              border-radius: 8px;
                              font-size: 16px;
                              width: 100%;
                              max-width: 400px;
                              transition: border-color 0.3s;
                            }
                            .gwl-input:focus {
                              outline: none;
                              border-color: hsl(262, 83%, 58%);
                            }
                            .gwl-image { max-width: 100%; height: auto; border-radius: 8px; }
                            h1, h2, h3 { margin: 1em 0 0.5em 0; color: #111; }
                            h1 { font-size: 2.5em; }
                            p { margin: 0.5em 0; color: #555; line-height: 1.6; }
                            ${output.css}
                          </style>
                        </head>
                        <body>
                          ${output.html}
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-2 border-border rounded-lg bg-white dark:bg-gray-900"
                    title="Vista Previa GWL+"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
