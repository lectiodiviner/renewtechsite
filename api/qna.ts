import type { VercelRequest, VercelResponse } from '@vercel/node';

// 간단한 메모리 스토리지
let qnaSubmissions: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`QnA API 호출: ${req.method} ${req.url}`);
  
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS 요청 처리');
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      console.log('POST 요청 본문:', req.body);
      
      // 기본 검증
      if (!req.body || !req.body.name || !req.body.email || !req.body.question) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // 새 제출 생성
      const submission = {
        id: `qna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: req.body.name,
        email: req.body.email,
        question: req.body.question,
        answer: null,
        isAnswered: false,
        createdAt: new Date().toISOString(),
        answeredAt: null,
      };
      
      qnaSubmissions.push(submission);
      console.log('QnA 제출 성공:', submission);
      
      return res.status(201).json(submission);
    } catch (error) {
      console.error('QnA 제출 에러:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  if (req.method === 'GET') {
    try {
      console.log('GET 요청 처리');
      return res.json(qnaSubmissions);
    } catch (error) {
      console.error('QnA 조회 에러:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
