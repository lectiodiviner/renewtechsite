import { type User, type InsertUser, type QnaSubmission, type InsertQnaSubmission } from "@shared/schema";
import { users, qnaSubmissions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// 데이터베이스 연결이 설정된 경우에만 import
let db: any = null;
let pool: any = null;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEW_DATABASE_URL') {
    const { db: dbInstance, pool: poolInstance } = await import("./db");
    db = dbInstance;
    pool = poolInstance;
  }
} catch (error) {
  console.warn("⚠️ 데이터베이스 연결을 초기화할 수 없습니다:", error);
}

export class SupabaseStorage implements IStorage {
  private isConnected(): boolean {
    return db !== null && pool !== null;
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.isConnected()) {
      console.warn('데이터베이스가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.isConnected()) {
      console.warn('데이터베이스가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!this.isConnected()) {
      throw new Error('데이터베이스가 연결되지 않았습니다.');
    }
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createQnaSubmission(insertQnaSubmission: InsertQnaSubmission): Promise<QnaSubmission> {
    if (!this.isConnected()) {
      throw new Error('데이터베이스가 연결되지 않았습니다.');
    }
    try {
      const result = await db.insert(qnaSubmissions).values(insertQnaSubmission).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating QnA submission:', error);
      throw error;
    }
  }

  async getQnaSubmissions(): Promise<QnaSubmission[]> {
    if (!this.isConnected()) {
      console.warn('데이터베이스가 연결되지 않았습니다.');
      return [];
    }
    try {
      const result = await db.select().from(qnaSubmissions).orderBy(desc(qnaSubmissions.createdAt));
      return result;
    } catch (error) {
      console.error('Error fetching QnA submissions:', error);
      return [];
    }
  }

  async getQnaSubmission(id: string): Promise<QnaSubmission | undefined> {
    if (!this.isConnected()) {
      console.warn('데이터베이스가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const result = await db.select().from(qnaSubmissions).where(eq(qnaSubmissions.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching QnA submission:', error);
      return undefined;
    }
  }

  async answerQnaSubmission(id: string, answer: string): Promise<QnaSubmission | undefined> {
    if (!this.isConnected()) {
      throw new Error('데이터베이스가 연결되지 않았습니다.');
    }
    try {
      const result = await db
        .update(qnaSubmissions)
        .set({
          answer,
          isAnswered: true,
          answeredAt: new Date()
        })
        .where(eq(qnaSubmissions.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating QnA submission:', error);
      return undefined;
    }
  }
}

// IStorage 인터페이스를 다시 export
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
