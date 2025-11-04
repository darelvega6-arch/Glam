import { Code, Zap, BookOpen, Component, Database, Cloud } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Motor de Vista Previa en Tiempo Real",
    description: "Ve tus cambios instantáneamente mientras escribes código GWL+",
  },
  {
    icon: BookOpen,
    title: "Plataforma de Aprendizaje Interactiva",
    description: "Aprende con tutoriales paso a paso y ejemplos prácticos",
  },
  {
    icon: Component,
    title: "Arquitectura Basada en Componentes",
    description: "Crea componentes reutilizables como en React",
  },
  {
    icon: Code,
    title: "Simplicidad Tipo Python",
    description: "Sintaxis limpia e intuitiva, fácil de aprender",
  },
  {
    icon: Database,
    title: "Integración con Base de Datos",
    description: "Maneja datos de forma sencilla y eficiente",
  },
  {
    icon: Cloud,
    title: "Despliegue con Un Clic",
    description: "Publica tus proyectos en segundos",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Características Poderosas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para crear aplicaciones web modernas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover-elevate active-elevate-2 transition-all"
                data-testid={`card-feature-${index}`}
              >
                <CardHeader className="gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
