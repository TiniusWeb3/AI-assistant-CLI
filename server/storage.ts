import { Task, Event, InsertTask, InsertEvent } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private events: Map<number, Event>;
  private taskId: number;
  private eventId: number;

  constructor() {
    this.tasks = new Map();
    this.events = new Map();
    this.taskId = 1;
    this.eventId = 1;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = {
      ...insertTask,
      id,
      completed: false,
      microsoftId: null,
      synced: false,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const event: Event = {
      ...insertEvent,
      id,
      googleId: null,
      synced: false,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
