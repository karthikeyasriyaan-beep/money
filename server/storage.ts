import { 
  type Subscription, 
  type InsertSubscription,
  type Transaction,
  type InsertTransaction,
  type SavingsAccount,
  type InsertSavingsAccount,
  type FinancialGoal,
  type InsertFinancialGoal,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subscription methods
  getSubscriptions(): Promise<Subscription[]>;
  getSubscription(id: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: string): Promise<boolean>;
  
  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  
  // Savings Account methods
  getSavingsAccounts(): Promise<SavingsAccount[]>;
  getSavingsAccount(id: string): Promise<SavingsAccount | undefined>;
  createSavingsAccount(account: InsertSavingsAccount): Promise<SavingsAccount>;
  updateSavingsAccount(id: string, account: Partial<InsertSavingsAccount>): Promise<SavingsAccount | undefined>;
  deleteSavingsAccount(id: string): Promise<boolean>;
  
  // Financial Goal methods
  getFinancialGoals(): Promise<FinancialGoal[]>;
  getFinancialGoal(id: string): Promise<FinancialGoal | undefined>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: string, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscriptions: Map<string, Subscription>;
  private transactions: Map<string, Transaction>;
  private savingsAccounts: Map<string, SavingsAccount>;
  private financialGoals: Map<string, FinancialGoal>;

  constructor() {
    this.users = new Map();
    this.subscriptions = new Map();
    this.transactions = new Map();
    this.savingsAccounts = new Map();
    this.financialGoals = new Map();
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

  // Subscription methods
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      createdAt: new Date(),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const existing = this.subscriptions.get(id);
    if (!existing) return undefined;
    
    const updated: Subscription = { ...existing, ...updates };
    this.subscriptions.set(id, updated);
    return updated;
  }

  async deleteSubscription(id: string): Promise<boolean> {
    return this.subscriptions.delete(id);
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      date: insertTransaction.date || new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    
    const updated: Transaction = { ...existing, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Savings Account methods
  async getSavingsAccounts(): Promise<SavingsAccount[]> {
    return Array.from(this.savingsAccounts.values());
  }

  async getSavingsAccount(id: string): Promise<SavingsAccount | undefined> {
    return this.savingsAccounts.get(id);
  }

  async createSavingsAccount(insertAccount: InsertSavingsAccount): Promise<SavingsAccount> {
    const id = randomUUID();
    const account: SavingsAccount = {
      ...insertAccount,
      id,
      createdAt: new Date(),
    };
    this.savingsAccounts.set(id, account);
    return account;
  }

  async updateSavingsAccount(id: string, updates: Partial<InsertSavingsAccount>): Promise<SavingsAccount | undefined> {
    const existing = this.savingsAccounts.get(id);
    if (!existing) return undefined;
    
    const updated: SavingsAccount = { ...existing, ...updates };
    this.savingsAccounts.set(id, updated);
    return updated;
  }

  async deleteSavingsAccount(id: string): Promise<boolean> {
    return this.savingsAccounts.delete(id);
  }

  // Financial Goal methods
  async getFinancialGoals(): Promise<FinancialGoal[]> {
    return Array.from(this.financialGoals.values());
  }

  async getFinancialGoal(id: string): Promise<FinancialGoal | undefined> {
    return this.financialGoals.get(id);
  }

  async createFinancialGoal(insertGoal: InsertFinancialGoal): Promise<FinancialGoal> {
    const id = randomUUID();
    const goal: FinancialGoal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
    };
    this.financialGoals.set(id, goal);
    return goal;
  }

  async updateFinancialGoal(id: string, updates: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const existing = this.financialGoals.get(id);
    if (!existing) return undefined;
    
    const updated: FinancialGoal = { ...existing, ...updates };
    this.financialGoals.set(id, updated);
    return updated;
  }

  async deleteFinancialGoal(id: string): Promise<boolean> {
    return this.financialGoals.delete(id);
  }
}

export const storage = new MemStorage();
