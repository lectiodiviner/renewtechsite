// 데이터베이스 연결 테스트 스크립트
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { qnaSubmissions } from './shared/schema.js';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// WebSocket 설정
const neonConfig = { webSocketConstructor: ws };

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL 환경변수가 설정되지 않았습니다.');
  console.log('📝 .env 파일에 DATABASE_URL을 추가해주세요.');
  console.log('예시: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.cktutvtbfrdnxkopeodj.supabase.co:5432/postgres');
  process.exit(1);
}

async function testDatabaseConnection() {
  console.log('🔍 데이터베이스 연결 테스트 시작...');
  
  try {
    // 데이터베이스 연결
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool, schema: { qnaSubmissions } });
    
    console.log('✅ 데이터베이스 연결 성공');
    
    // 테이블 존재 확인
    console.log('🔍 qna_submissions 테이블 확인 중...');
    const result = await db.select().from(qnaSubmissions).limit(1);
    console.log('✅ qna_submissions 테이블 접근 성공');
    
    // 테스트 데이터 삽입
    console.log('📝 테스트 데이터 삽입 중...');
    const testSubmission = {
      name: 'Test User',
      email: 'test@example.com',
      question: 'This is a test question for database connection verification.'
    };
    
    const inserted = await db.insert(qnaSubmissions).values(testSubmission).returning();
    console.log('✅ 테스트 데이터 삽입 성공:', inserted[0].id);
    
    // 테스트 데이터 조회
    console.log('🔍 테스트 데이터 조회 중...');
    const retrieved = await db.select().from(qnaSubmissions).where(eq(qnaSubmissions.id, inserted[0].id));
    console.log('✅ 테스트 데이터 조회 성공:', retrieved[0]);
    
    // 테스트 데이터 삭제
    console.log('🗑️ 테스트 데이터 정리 중...');
    await db.delete(qnaSubmissions).where(eq(qnaSubmissions.id, inserted[0].id));
    console.log('✅ 테스트 데이터 정리 완료');
    
    console.log('\n🎉 모든 테스트 통과! 데이터베이스가 정상적으로 작동합니다.');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    
    if (error.message.includes('relation "qna_submissions" does not exist')) {
      console.log('\n💡 해결방법:');
      console.log('1. Supabase SQL Editor에서 create-tables.sql 파일을 실행하세요');
      console.log('2. qna_submissions 테이블이 생성되었는지 확인하세요');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n💡 해결방법:');
      console.log('1. DATABASE_URL의 비밀번호가 올바른지 확인하세요');
      console.log('2. Supabase 대시보드에서 올바른 연결 문자열을 복사하세요');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 해결방법:');
      console.log('1. 인터넷 연결을 확인하세요');
      console.log('2. Supabase 프로젝트가 활성화되어 있는지 확인하세요');
    }
    
    process.exit(1);
  } finally {
    // 연결 종료
    if (pool) {
      await pool.end();
    }
  }
}

// 스크립트 실행
testDatabaseConnection();
