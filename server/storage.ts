import { type User, type InsertUser, type QnaSubmission, type InsertQnaSubmission } from "../shared/schema.js";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // QNA methods
  createQnaSubmission(submission: InsertQnaSubmission): Promise<QnaSubmission>;
  getQnaSubmissions(): Promise<QnaSubmission[]>;
  getQnaSubmission(id: string): Promise<QnaSubmission | undefined>;
  answerQnaSubmission(id: string, answer: string): Promise<QnaSubmission | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private qnaSubmissions: Map<string, QnaSubmission>;

  constructor() {
    this.users = new Map();
    this.qnaSubmissions = new Map();
  }

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

  async createQnaSubmission(insertQnaSubmission: InsertQnaSubmission): Promise<QnaSubmission> {
    const id = randomUUID();
    const qnaSubmission: QnaSubmission = {
      ...insertQnaSubmission,
      id,
      answer: null,
      isAnswered: false,
      createdAt: new Date(),
      answeredAt: null,
    };
    this.qnaSubmissions.set(id, qnaSubmission);
    return qnaSubmission;
  }

  async getQnaSubmissions(): Promise<QnaSubmission[]> {
    return Array.from(this.qnaSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getQnaSubmission(id: string): Promise<QnaSubmission | undefined> {
    return this.qnaSubmissions.get(id);
  }

  async answerQnaSubmission(id: string, answer: string): Promise<QnaSubmission | undefined> {
    const submission = this.qnaSubmissions.get(id);
    if (submission) {
      submission.answer = answer;
      submission.isAnswered = true;
      submission.answeredAt = new Date();
      this.qnaSubmissions.set(id, submission);
    }
    return submission;
  }
}

export const storage = new MemStorage();
