import { useState } from "react";
import TutorialCard from "@/components/TutorialCard";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import { interpretGWL, tutorialExamples } from "@/lib/gwl-interpreter";
import { Button } from "@/components/ui/button";
import { Code2, Home, ChevronLeft, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TutorialsPageProps {
  onBack: () => void;
}

const tutorials = [
  {
    id: 1,
    title: "Hola Mundo en GWL+",
    description: "Aprende a crear tu primer componente con elementos básicos",
    category: "Fundamentos",
    duration: "10 min",
    completed: false,
    content: "En este tutorial aprenderás los conceptos básicos de GWL+. Crearás tu primer componente con un título, texto y botón. Los componentes son bloques reutilizables de código.",
    starterCode: tutorialExamples.basic,
  },
  {
    id: 2,
    title: "Trabajando con Estilos",
    description: "Aprende a personalizar el aspecto de tus componentes",
    category: "Diseño",
    duration: "15 min",
    completed: false,
    content: "Los estilos en GWL+ te permiten personalizar la apariencia de tus componentes. Usa la sintaxis 'style nombre:' seguido de reglas CSS entre llaves.",
    starterCode: tutorialExamples.withStyles,
  },
  {
    id: 3,
    title: "Variables Dinámicas",
    description: "Usa variables para hacer tu código más flexible",
    category: "Fundamentos",
    duration: "12 min",
    completed: false,
    content: "Las variables te permiten almacenar valores que puedes reutilizar. Declara variables con 'set nombre = valor' y úsalas con $nombre.",
    starterCode: tutorialExamples.withVariables,
  },
  {
    id: 4,
    title: "Aplicación Completa",
    description: "Combina todo lo aprendido en una app funcional",
    category: "Avanzado",
    duration: "20 min",
    completed: false,
    content: "Ahora combinaremos componentes, estilos y variables para crear una aplicación completa con header, contenido y formulario.",
    starterCode: tutorialExamples.complete,
  },
];

export default function TutorialsPage({ onBack }: TutorialsPageProps) {
  const [selectedTutorial, setSelectedTutorial] = useState(tutorials[0]);
  const [code, setCode] = useState(selectedTutorial.starterCode);
  const [output, setOutput] = useState(() => interpretGWL(selectedTutorial.starterCode));
  const currentIndex = tutorials.findIndex(t => t.id === selectedTutorial.id);

  const handleTutorialSelect = (tutorial: typeof tutorials[0]) => {
    setSelectedTutorial(tutorial);
    setCode(tutorial.starterCode);
    setOutput(interpretGWL(tutorial.starterCode));
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = (codeToRun: string) => {
    const result = interpretGWL(codeToRun);
    setOutput(result);
  };

  const handleNext = () => {
    if (currentIndex < tutorials.length - 1) {
      handleTutorialSelect(tutorials[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleTutorialSelect(tutorials[currentIndex - 1]);
    }
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
            <span className="text-xl font-bold">Tutoriales GWL+</span>
          </div>
        </div>
        
        <ThemeToggle />
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">
        <div className="lg:col-span-1 border-r overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Lecciones</h2>
          <div className="space-y-4">
            {tutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                category={tutorial.category}
                duration={tutorial.duration}
                completed={tutorial.completed}
                onClick={() => handleTutorialSelect(tutorial)}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          <div className="border-b p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{selectedTutorial.title}</CardTitle>
                <CardDescription className="text-base">
                  {selectedTutorial.content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    data-testid="button-previous-tutorial"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} de {tutorials.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentIndex === tutorials.length - 1}
                    data-testid="button-next-tutorial"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
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
      </div>
    </div>
  );
}
