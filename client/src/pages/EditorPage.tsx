import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import { interpretGWL, exampleGWLCode } from "@/lib/gwl-interpreter";
import { Button } from "@/components/ui/button";
import { Code2, Home } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface EditorPageProps {
  onBack: () => void;
}

export default function EditorPage({ onBack }: EditorPageProps) {
  const [code, setCode] = useState(exampleGWLCode);
  const [output, setOutput] = useState(() => interpretGWL(exampleGWLCode));

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = (codeToRun: string) => {
    const result = interpretGWL(codeToRun);
    setOutput(result);
  };

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
            Mi Proyecto
          </span>
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
        <div className="h-full border-r">
          <CodeEditor
            initialCode={code}
            onCodeChange={handleCodeChange}
            onRun={handleRun}
          />
        </div>
        
        <div className="h-full">
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
