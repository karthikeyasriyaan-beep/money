import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  nextPaymentDate: timestamp("next_payment_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  category: text("category").notNull(),
  date: timestamp("date").default(sql`now()`).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const savingsAccounts = pgTable("savings_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default('0'),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const financialGoals = pgTable("financial_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Insert schemas with string coercion for form inputs
export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  cost: z.string().min(1, "Cost is required").transform(val => val),
  nextPaymentDate: z.date().or(z.string().transform(str => new Date(str))),
}).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: z.string().min(1, "Amount is required").transform(val => val),
  date: z.date().or(z.string().transform(str => new Date(str))),
}).omit({
  id: true,
  createdAt: true,
});

export const insertSavingsAccountSchema = createInsertSchema(savingsAccounts, {
  balance: z.string().optional().transform(val => val || "0"),
  targetAmount: z.string().optional().nullable().transform(val => val || null),
  interestRate: z.string().optional().transform(val => val || "0"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals, {
  targetAmount: z.string().min(1, "Target amount is required").transform(val => val),
  currentAmount: z.string().optional().transform(val => val || "0"),
  targetDate: z.date().optional().nullable().or(z.string().optional().nullable().transform(str => str ? new Date(str) : null)),
}).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertSavingsAccount = z.infer<typeof insertSavingsAccountSchema>;
export type SavingsAccount = typeof savingsAccounts.$inferSelect;

export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type FinancialGoal = typeof financialGoals.$inferSelect;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
