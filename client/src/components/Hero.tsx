import { Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Code_editor_hero_image_e3163e2b.png";

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Code2 className="h-12 w-12 text-primary" />
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            GlaWebLang
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <p className="text-2xl md:text-3xl font-semibold text-white">
            GWL+ - Tu Lenguaje, Tu Creatividad
          </p>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Crea sitios web increíbles con un lenguaje de programación innovador 
          que combina la simplicidad de Python con la potencia de React
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="default"
            onClick={onGetStarted}
            data-testid="button-get-started"
            className="text-lg px-8 py-6 h-auto"
          >
            <Code2 className="h-5 w-5 mr-2" />
            Empezar a Programar
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => console.log("View docs")}
            data-testid="button-view-docs"
            className="text-lg px-8 py-6 h-auto bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
          >
            Ver Documentación
          </Button>
        </div>
        
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Editor en Tiempo Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Sintaxis Intuitiva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Vista Previa Instantánea</span>
          </div>
        </div>
      </div>
    </section>
  );
}
