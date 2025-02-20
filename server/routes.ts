import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertEventSchema } from "@shared/schema";
import { notionService } from "./services/notion";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  // Tasks
  app.get("/api/tasks", async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid task data" });
    }

    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await storage.updateTask(id, req.body);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  });

  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    const result = insertEventSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid event data" });
    }

    const event = await storage.createEvent(result.data);
    res.json(event);
  });

  // Notion Routes
  app.get("/api/notion/databases", async (req, res) => {
    try {
      const databases = await notionService.getDatabases();
      res.json(databases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Notion databases" });
    }
  });

  app.get("/api/notion/:databaseId/tasks", async (req, res) => {
    try {
      const tasks = await notionService.getTasks(req.params.databaseId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Notion tasks" });
    }
  });

  app.post("/api/sync/notion/:databaseId", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      let syncCount = 0;

      for (const task of tasks) {
        if (!task.synced) {
          await notionService.createTask(req.params.databaseId, {
            title: task.title,
            description: task.description ?? undefined,
            completed: task.completed,
            dueDate: task.dueDate ?? undefined
          });
          await storage.updateTask(task.id, { synced: true });
          syncCount++;
        }
      }

      res.json({ count: syncCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Notion" });
    }
  });

  const server = createServer(app);
  return server;
}