import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// 간단한 메모리 스토리지 (Vercel 서버리스 함수용)
const qnaSubmissions: Array<{
  id: string;
  name: string;
  email: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
  createdAt: Date;
  answeredAt?: Date;
}> = [];

// Zod 스키마
const insertQnaSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  question: z.string().min(1, "Question is required"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`API 요청 받음: ${req.method} ${req.url}`);
  console.log('요청 헤더:', req.headers);
  console.log('요청 본문:', req.body);
  
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS 요청 처리');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('QnA 제출 요청 받음:', req.body);
      
      // 요청 본문 검증
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: "Invalid request body" });
      }
      
      const validatedData = insertQnaSubmissionSchema.parse(req.body);
      console.log('검증된 데이터:', validatedData);
      
      // 새 제출 생성
      const submission = {
        id: `qna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        answer: null,
        isAnswered: false,
        createdAt: new Date(),
        answeredAt: null,
      };
      
      qnaSubmissions.push(submission);
      console.log('QnA 제출 성공:', submission);
      
      return res.status(201).json(submission);
    } catch (error) {
      console.error('QnA 제출 에러:', error);
      if (error instanceof z.ZodError) {
        console.error('Zod 검증 에러:', error.errors);
        return res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error('서버 에러:', error);
        return res.status(500).json({ 
          error: "Internal server error", 
          details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
        });
      }
    }
  }

  if (req.method === 'GET') {
    try {
      console.log('QnA 목록 조회 요청');
      const sortedSubmissions = qnaSubmissions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      return res.json(sortedSubmissions);
    } catch (error) {
      console.error('QnA 목록 조회 에러:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
