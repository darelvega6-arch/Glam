import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SyntaxShowcase() {
  const gwlExample = `component Card(title, description):
  render:
    Container(class="card"):
      Heading(title)
      Text(description)
      Button("Leer más")
    end
end`;

  const traditionalExample = `function Card({ title, description }) {
  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{description}</p>
      <button>Leer más</button>
    </div>
  );
}`;

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            Sintaxis Innovadora
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Más Simple, Más Poderoso
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compara GWL+ con código tradicional
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">GWL+</h3>
              <Badge variant="default">Nuevo</Badge>
            </div>
            <pre className="bg-card-foreground/5 p-6 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-foreground whitespace-pre">
                {gwlExample}
              </code>
            </pre>
            <p className="mt-4 text-muted-foreground">
              Sintaxis clara inspirada en Python, fácil de leer y escribir
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">JavaScript/React</h3>
              <Badge variant="secondary">Tradicional</Badge>
            </div>
            <pre className="bg-card-foreground/5 p-6 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-foreground whitespace-pre">
                {traditionalExample}
              </code>
            </pre>
            <p className="mt-4 text-muted-foreground">
              Sintaxis más compleja con múltiples símbolos especiales
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
