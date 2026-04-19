import { pgTable, text, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const focusSessionsTable = pgTable("focus_sessions", {
  id: serial("id").primaryKey(),
  goal: text("goal").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: text("status", { enum: ["active", "completed", "cancelled"] }).notNull().default("active"),
  blockedSites: json("blocked_sites").$type<string[]>().notNull().default([]),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFocusSessionSchema = createInsertSchema(focusSessionsTable).omit({ id: true, createdAt: true });
export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusSession = typeof focusSessionsTable.$inferSelect;
