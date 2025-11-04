import PreviewPanel from "../PreviewPanel";

const sampleHTML = `
  <h1>¡Hola Mundo!</h1>
  <p>Este es un ejemplo de vista previa</p>
  <button class="gwl-button">Click aquí</button>
`;

const sampleCSS = `
  h1 { color: hsl(262, 83%, 58%); }
`;

export default function PreviewPanelExample() {
  return (
    <div className="h-96">
      <PreviewPanel html={sampleHTML} css={sampleCSS} errors={[]} />
    </div>
  );
}
