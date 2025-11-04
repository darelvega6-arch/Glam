import ProjectCard from "../ProjectCard";

export default function ProjectCardExample() {
  return (
    <div className="max-w-md p-4">
      <ProjectCard
        name="Mi Primer Sitio Web"
        lastModified="hace 2 horas"
        linesOfCode={42}
        onEdit={() => console.log("Edit project")}
        onPreview={() => console.log("Preview project")}
        onDelete={() => console.log("Delete project")}
      />
    </div>
  );
}
