import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blockedSitesTable = pgTable("blocked_sites", {
  id: serial("id").primaryKey(),
  pattern: text("pattern").notNull(),
  label: text("label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBlockedSiteSchema = createInsertSchema(blockedSitesTable).omit({ id: true, createdAt: true });
export type InsertBlockedSite = z.infer<typeof insertBlockedSiteSchema>;
export type BlockedSite = typeof blockedSitesTable.$inferSelect;
