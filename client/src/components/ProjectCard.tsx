import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, ExternalLink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  name: string;
  lastModified: string;
  linesOfCode: number;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  name,
  lastModified,
  linesOfCode,
  onEdit,
  onPreview,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2 transition-all" data-testid="card-project">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg mb-1">{name}</CardTitle>
              <CardDescription className="text-sm">
                Modificado {lastModified}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {linesOfCode} líneas
          </Badge>
        </div>
      </CardHeader>
      
      <CardFooter className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={onEdit}
          data-testid="button-edit-project"
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onPreview}
          data-testid="button-preview-project"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Vista Previa
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          data-testid="button-delete-project"
          className="ml-auto text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
