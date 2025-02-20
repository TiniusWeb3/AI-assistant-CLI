import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertEventSchema } from "@shared/schema";
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

  const server = createServer(app);
  return server;
}
