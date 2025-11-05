import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { gwlService } from "./gwl-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener proyectos" });
    }
  });

  // Get a single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener proyecto" });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Error al crear proyecto" });
    }
  });

  // Update a project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertProjectSchema.partial().parse(req.body);
      
      const updatedProject = await storage.updateProject(id, updates);
      
      if (!updatedProject) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Error al actualizar proyecto" });
    }
  });

  // Delete a project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  });

  // GWL Execution routes
  
  // Validation schemas
  const transpileSchema = z.object({
    code: z.string().max(100000, 'Código demasiado largo (máximo 100KB)')
  });

  const executeSchema = z.object({
    code: z.string().max(100000, 'Código demasiado largo (máximo 100KB)'),
    timeout: z.number().min(100).max(30000).optional().default(5000)
  });
  
  // Transpile GWL code to HTML/CSS/JS
  app.post("/api/gwl/transpile", async (req, res) => {
    try {
      const validatedData = transpileSchema.parse(req.body);
      const result = gwlService.transpile(validatedData.code);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: "Error al transpilar código", details: errorMsg });
    }
  });

  // Execute GWL code (with sandbox and timeout)
  app.post("/api/gwl/execute", async (req, res) => {
    try {
      const validatedData = executeSchema.parse(req.body);
      const result = await gwlService.execute(validatedData.code, validatedData.timeout);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: "Error al ejecutar código", details: errorMsg });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
