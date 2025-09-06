import { createClient } from '@supabase/supabase-js';

// 새 Supabase 프로젝트 설정
const NEW_SUPABASE_URL = 'https://cktutvtbfrdnxkopeodj.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU';

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

async function createTables() {
  try {
    console.log('새 Supabase 프로젝트에 테이블을 생성합니다...');
    
    // users 테이블 생성
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
    
    // qna_submissions 테이블 생성
    const createQnaTable = `
      CREATE TABLE IF NOT EXISTS qna_submissions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT,
        is_answered BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        answered_at TIMESTAMP
      );
    `;
    
    // SQL Editor에서 실행하거나, Supabase CLI를 사용하여 실행하세요
    console.log('다음 SQL을 새 Supabase 프로젝트의 SQL Editor에서 실행하세요:');
    console.log('\n=== Users 테이블 ===');
    console.log(createUsersTable);
    console.log('\n=== QNA Submissions 테이블 ===');
    console.log(createQnaTable);
    
    console.log('\n또는 Supabase CLI를 사용하여 실행할 수 있습니다:');
    console.log('1. supabase init');
    console.log('2. supabase link --project-ref YOUR_PROJECT_REF');
    console.log('3. supabase db push');
    
  } catch (error) {
    console.error('테이블 생성 중 오류 발생:', error);
  }
}

createTables();
