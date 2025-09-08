import type { Express } from "express";
import { createServer, type Server } from "http";
import { SupabaseStorageV2 } from "./supabase-storage-v2";
import { storage as memStorage } from "./storage";
import { emailService } from "./email";
import { insertQnaSubmissionSchema } from "@shared/schema";
import { z } from "zod";

// Supabase 설정이 있는 경우 SupabaseStorageV2 사용, 그렇지 않으면 메모리 스토리지 사용
const storage = process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY
  ? new SupabaseStorageV2() 
  : memStorage;

if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('✅ Supabase 스토리지 사용');
} else {
  console.log('⚠️ 메모리 스토리지 사용 (Supabase 설정이 없음)');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // QNA Routes
  
  // Submit a new question
  app.post("/api/qna", async (req, res) => {
    try {
      const validatedData = insertQnaSubmissionSchema.parse(req.body);
      const submission = await storage.createQnaSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all QNA submissions
  app.get("/api/qna", async (req, res) => {
    try {
      const submissions = await storage.getQnaSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Answer a specific question (admin feature)
  app.put("/api/qna/:id/answer", async (req, res) => {
    try {
      const { id } = req.params;
      const { answer } = req.body;
      
      if (!answer || typeof answer !== 'string') {
        return res.status(400).json({ error: "Answer is required" });
      }

      // 먼저 기존 문의 정보를 가져옴
      const originalSubmission = await storage.getQnaSubmission(id);
      if (!originalSubmission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // 답변 저장
      const updatedSubmission = await storage.answerQnaSubmission(id, answer);
      
      if (!updatedSubmission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // 이메일 발송 시도
      if (emailService.isConfigured()) {
        try {
          const emailSent = await emailService.sendQnAReply(
            originalSubmission.name,
            originalSubmission.email,
            answer
          );
          
          if (emailSent) {
            console.log(`답변 이메일이 ${originalSubmission.email}로 발송되었습니다.`);
          } else {
            console.error(`답변 이메일 발송에 실패했습니다: ${originalSubmission.email}`);
          }
        } catch (emailError) {
          console.error('이메일 발송 중 오류:', emailError);
          // 이메일 발송 실패해도 답변은 저장되므로 계속 진행
        }
      } else {
        console.warn('이메일 서비스가 설정되지 않아 이메일을 발송할 수 없습니다.');
      }

      res.json(updatedSubmission);
    } catch (error) {
      console.error('답변 저장 중 오류:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
