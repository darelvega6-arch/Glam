import { type User, type InsertUser, type Project, type InsertProject } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    
    // Add sample projects for demo
    this.seedProjects();
  }

  private seedProjects() {
    const sampleProjects: Project[] = [
      {
        id: randomUUID(),
        name: "Mi Primer Sitio",
        code: `// Mi primer proyecto GWL+
component Welcome():
  render:
    Heading("¡Hola Mundo!")
    Text("Este es mi primer sitio web en GWL+")
    Button("Click aquí")
end`,
        userId: null,
      },
      {
        id: randomUUID(),
        name: "Portfolio Personal",
        code: `// Portfolio con estilos
set name = "Tu Nombre"

style header: {
  background: #6366f1;
  color: white;
  padding: 30px;
  text-align: center;
}

component Portfolio():
  render:
    Container(class="header"):
      Heading($name)
      Text("Desarrollador Web")
    end
end`,
        userId: null,
      },
      {
        id: randomUUID(),
        name: "Landing Page",
        code: `// Landing page completa
set title = "Mi Producto"
set subtitle = "La mejor solución"

style hero: {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px;
  color: white;
  text-align: center;
  border-radius: 12px;
}

component Landing():
  render:
    Container(class="hero"):
      Heading($title)
      Subheading($subtitle)
      Button("Comenzar", onClick="¡Bienvenido!")
    end
end`,
        userId: null,
      },
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      userId: insertProject.userId ?? null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) {
      return undefined;
    }
    
    const updatedProject: Project = { 
      ...project, 
      ...updates,
      userId: updates.userId !== undefined ? updates.userId : project.userId
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();
