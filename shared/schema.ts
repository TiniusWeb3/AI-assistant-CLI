import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  microsoftId: text("microsoft_id"),
  synced: boolean("synced").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  googleId: text("google_id"),
  synced: boolean("synced").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auth = pgTable("auth", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(), // 'microsoft' or 'google'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  microsoftId: true,
  synced: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  googleId: true,
  synced: true,
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
