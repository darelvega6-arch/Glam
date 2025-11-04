import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Save, Share2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  initialCode = "",
  onCodeChange,
  onRun,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [lineCount, setLineCount] = useState(
    initialCode.split("\n").length
  );

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    setLineCount(newCode.split("\n").length);
    onCodeChange?.(newCode);
  };

  const handleRun = () => {
    onRun?.(code);
    console.log("Running code:", code);
  };

  const handleSave = () => {
    console.log("Saving project");
  };

  const handleReset = () => {
    setCode(initialCode);
    setLineCount(initialCode.split("\n").length);
    onCodeChange?.(initialCode);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            GWL+
          </Badge>
          <span className="text-sm text-muted-foreground">
            {lineCount} líneas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            data-testid="button-reset-code"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            data-testid="button-save-code"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            data-testid="button-share-code"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            data-testid="button-run-code"
          >
            <Play className="h-4 w-4 mr-1" />
            Ejecutar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-auto">
        <div className="w-12 bg-muted/30 flex flex-col items-center py-4 text-xs text-muted-foreground font-mono select-none border-r">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="h-6 flex items-center">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          data-testid="textarea-code-editor"
          className="flex-1 p-4 font-mono text-sm bg-transparent resize-none focus:outline-none focus:ring-0 min-h-full"
          placeholder="# Escribe tu código GWL+ aquí..."
          spellCheck={false}
        />
      </div>
    </Card>
  );
}