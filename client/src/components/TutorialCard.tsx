import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TutorialCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  completed: boolean;
  onClick: () => void;
}

export default function TutorialCard({
  title,
  description,
  category,
  duration,
  completed,
  onClick,
}: TutorialCardProps) {
  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid="card-tutorial"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <Badge variant="secondary">{category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
          )}
          <div>
            <CardTitle className="text-lg mb-2">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
