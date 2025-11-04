import CodeEditor from "../CodeEditor";

const exampleCode = `// Mi primer componente GWL+
component HelloWorld():
  render:
    Heading("¡Hola Mundo!")
    Text("Bienvenido a GWL+")
    Button("Click aquí")
end`;

export default function CodeEditorExample() {
  return (
    <div className="h-96">
      <CodeEditor
        initialCode={exampleCode}
        onCodeChange={(code) => console.log("Code changed:", code)}
        onRun={(code) => console.log("Running:", code)}
      />
    </div>
  );
}
