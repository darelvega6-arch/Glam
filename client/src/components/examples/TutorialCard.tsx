import TutorialCard from "../TutorialCard";

export default function TutorialCardExample() {
  return (
    <div className="max-w-md p-4">
      <TutorialCard
        title="Introducción a GWL+"
        description="Aprende los fundamentos del lenguaje y crea tu primer componente"
        category="Fundamentos"
        duration="15 min"
        completed={false}
        onClick={() => console.log("Tutorial clicked")}
      />
    </div>
  );
}
