import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, RefreshCw, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PreviewPanelProps {
  html: string;
  css: string;
  errors?: string[];
}

type DeviceType = "desktop" | "tablet" | "mobile";

export default function PreviewPanel({ html, css, errors = [] }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");

  const deviceSizes = {
    desktop: "w-full",
    tablet: "w-[768px]",
    mobile: "w-[375px]",
  };

  const combinedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
          .gwl-preview { padding: 20px; text-align: center; color: #888; }
          .gwl-error { padding: 20px; color: #ef4444; background: #fee; border-radius: 8px; }
          .gwl-button { 
            padding: 10px 20px; 
            background: hsl(262, 83%, 58%);
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-size: 14px;
          }
          .gwl-button:hover { background: hsl(262, 83%, 50%); }
          .gwl-container { padding: 20px; margin: 10px 0; }
          .gwl-input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            width: 100%;
            max-width: 300px;
          }
          .gwl-image { max-width: 100%; height: auto; border-radius: 8px; }
          h1 { font-size: 2em; margin: 0.5em 0; color: #111; }
          p { margin: 0.5em 0; color: #555; line-height: 1.6; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Vista Previa</Badge>
          {errors.length > 0 && (
            <Badge variant="destructive">{errors.length} errores</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              size="icon"
              variant={device === "desktop" ? "secondary" : "ghost"}
              onClick={() => setDevice("desktop")}
              data-testid="button-device-desktop"
              className="h-7 w-7"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={device === "tablet" ? "secondary" : "ghost"}
              onClick={() => setDevice("tablet")}
              data-testid="button-device-tablet"
              className="h-7 w-7"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={device === "mobile" ? "secondary" : "ghost"}
              onClick={() => setDevice("mobile")}
              data-testid="button-device-mobile"
              className="h-7 w-7"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-refresh-preview"
            className="h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-fullscreen-preview"
            className="h-9 w-9"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="p-4 bg-destructive/10 border-b">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-destructive" data-testid={`text-error-${i}`}>
              {error}
            </p>
          ))}
        </div>
      )}
      
      <div className="flex-1 overflow-auto bg-muted/20 flex justify-center p-4">
        <div className={`${deviceSizes[device]} transition-all duration-300 bg-background rounded-lg shadow-lg overflow-hidden`}>
          <iframe
            srcDoc={combinedHTML}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
            data-testid="iframe-preview"
          />
        </div>
      </div>
    </Card>
  );
}
