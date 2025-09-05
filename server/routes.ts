import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubscriptionSchema,
  insertTransactionSchema,
  insertSavingsAccountSchema,
  insertFinancialGoalSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Subscription routes
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      const data = insertSubscriptionSchema.parse(req.body);
      const subscription = await storage.createSubscription(data);
      res.json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create subscription" });
      }
    }
  });

  app.put("/api/subscriptions/:id", async (req, res) => {
    try {
      const data = insertSubscriptionSchema.partial().parse(req.body);
      const subscription = await storage.updateSubscription(req.params.id, data);
      if (!subscription) {
        res.status(404).json({ message: "Subscription not found" });
        return;
      }
      res.json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update subscription" });
      }
    }
  });

  app.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSubscription(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Subscription not found" });
        return;
      }
      res.json({ message: "Subscription deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subscription" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(data);
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const data = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, data);
      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update transaction" });
      }
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTransaction(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // Savings Account routes
  app.get("/api/savings", async (req, res) => {
    try {
      const accounts = await storage.getSavingsAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings accounts" });
    }
  });

  app.post("/api/savings", async (req, res) => {
    try {
      const data = insertSavingsAccountSchema.parse(req.body);
      const account = await storage.createSavingsAccount(data);
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create savings account" });
      }
    }
  });

  app.put("/api/savings/:id", async (req, res) => {
    try {
      const data = insertSavingsAccountSchema.partial().parse(req.body);
      const account = await storage.updateSavingsAccount(req.params.id, data);
      if (!account) {
        res.status(404).json({ message: "Savings account not found" });
        return;
      }
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update savings account" });
      }
    }
  });

  app.delete("/api/savings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSavingsAccount(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Savings account not found" });
        return;
      }
      res.json({ message: "Savings account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete savings account" });
    }
  });

  // Financial Goals routes
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getFinancialGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const data = insertFinancialGoalSchema.parse(req.body);
      const goal = await storage.createFinancialGoal(data);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create financial goal" });
      }
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const data = insertFinancialGoalSchema.partial().parse(req.body);
      const goal = await storage.updateFinancialGoal(req.params.id, data);
      if (!goal) {
        res.status(404).json({ message: "Financial goal not found" });
        return;
      }
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update financial goal" });
      }
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFinancialGoal(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Financial goal not found" });
        return;
      }
      res.json({ message: "Financial goal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete financial goal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
