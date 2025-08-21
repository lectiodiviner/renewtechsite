import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const qnaSubmissions = pgTable("qna_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  isAnswered: boolean("is_answered").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  answeredAt: timestamp("answered_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQnaSubmissionSchema = createInsertSchema(qnaSubmissions).pick({
  name: true,
  email: true,
  question: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQnaSubmission = z.infer<typeof insertQnaSubmissionSchema>;
export type QnaSubmission = typeof qnaSubmissions.$inferSelect;
