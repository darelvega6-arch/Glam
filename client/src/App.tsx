import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LandingPage from "@/pages/LandingPage";
import EditorPage from "@/pages/EditorPage";
import TutorialsPage from "@/pages/TutorialsPage";
import ProjectsPage from "@/pages/ProjectsPage";

type Page = "landing" | "editor" | "tutorials" | "projects";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();

  const handleNavigateToEditor = (projectId?: string) => {
    setCurrentProjectId(projectId);
    setCurrentPage("editor");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage 
            onGetStarted={() => handleNavigateToEditor()}
            onNavigateToTutorials={() => setCurrentPage("tutorials")}
            onNavigateToProjects={() => setCurrentPage("projects")}
          />
        );
      case "editor":
        return (
          <EditorPage
            onBack={() => setCurrentPage("landing")}
            projectId={currentProjectId}
          />
        );
      case "tutorials":
        return <TutorialsPage onBack={() => setCurrentPage("landing")} />;
      case "projects":
        return (
          <ProjectsPage
            onBack={() => setCurrentPage("landing")}
            onEditProject={(projectId) => handleNavigateToEditor(projectId)}
          />
        );
      default:
        return (
          <LandingPage 
            onGetStarted={() => handleNavigateToEditor()}
            onNavigateToTutorials={() => setCurrentPage("tutorials")}
            onNavigateToProjects={() => setCurrentPage("projects")}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {renderPage()}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
