import type { Express } from "express";
import { createServer, type Server } from "http";
import { SupabaseStorageV2 } from "./supabase-storage-v2.js";
import { storage as memStorage, type IStorage } from "./storage.js";
import { emailService } from "./email.js";
import { insertQnaSubmissionSchema } from "../shared/schema.js";
import { z } from "zod";

// Supabase 설정이 있는 경우 SupabaseStorageV2 사용, 그렇지 않으면 메모리 스토리지 사용
const hasSupabaseUrl = !!process.env.VITE_SUPABASE_URL;
const hasSupabaseKey = !!process.env.VITE_SUPABASE_ANON_KEY;
const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('환경 변수 확인:');
console.log('- VITE_SUPABASE_URL:', hasSupabaseUrl ? '설정됨' : '설정되지 않음');
console.log('- VITE_SUPABASE_ANON_KEY:', hasSupabaseKey ? '설정됨' : '설정되지 않음');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', hasServiceKey ? '설정됨' : '설정되지 않음');

const storage = hasSupabaseUrl && hasSupabaseKey
  ? new SupabaseStorageV2() 
  : memStorage;

if (hasSupabaseUrl && hasSupabaseKey) {
  console.log('✅ Supabase 스토리지 사용');
} else {
  console.log('⚠️ 메모리 스토리지 사용 (Supabase 설정이 없음)');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // QNA Routes
  
  // Submit a new question
  app.post("/api/qna", async (req, res) => {
    try {
      console.log('QnA 제출 요청 받음:', req.body);
      
      // 요청 본문 검증
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: "Invalid request body" });
      }
      
      const validatedData = insertQnaSubmissionSchema.parse(req.body);
      console.log('검증된 데이터:', validatedData);
      
      // 스토리지가 초기화되었는지 확인
      if (!storage) {
        console.error('스토리지가 초기화되지 않았습니다.');
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const submission = await storage.createQnaSubmission(validatedData);
      console.log('QnA 제출 성공:', submission);
      res.status(201).json(submission);
    } catch (error) {
      console.error('QnA 제출 에러:', error);
      if (error instanceof z.ZodError) {
        console.error('Zod 검증 에러:', error.errors);
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error('서버 에러:', error);
        res.status(500).json({ 
          error: "Internal server error", 
          details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
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
