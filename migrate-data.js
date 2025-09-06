import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// 새 Supabase 프로젝트 설정
const NEW_SUPABASE_URL = 'https://cktutvtbfrdnxkopeodj.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU';

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

async function migrateData() {
  try {
    console.log('데이터 마이그레이션을 시작합니다...');
    
    // 백업 파일에서 데이터 읽기
    const usersData = JSON.parse(fs.readFileSync('backup-users.json', 'utf8'));
    const qnaData = JSON.parse(fs.readFileSync('backup-qna-submissions.json', 'utf8'));
    
    // Users 데이터 마이그레이션
    if (usersData.length > 0) {
      console.log(`${usersData.length}개의 사용자 데이터를 마이그레이션합니다...`);
      
      const { data: insertedUsers, error: usersError } = await newSupabase
        .from('users')
        .insert(usersData);
      
      if (usersError) {
        console.error('Users 데이터 마이그레이션 실패:', usersError);
      } else {
        console.log('Users 데이터 마이그레이션 완료!');
      }
    }
    
    // QNA Submissions 데이터 마이그레이션
    if (qnaData.length > 0) {
      console.log(`${qnaData.length}개의 QNA 데이터를 마이그레이션합니다...`);
      
      const { data: insertedQna, error: qnaError } = await newSupabase
        .from('qna_submissions')
        .insert(qnaData);
      
      if (qnaError) {
        console.error('QNA 데이터 마이그레이션 실패:', qnaError);
      } else {
        console.log('QNA 데이터 마이그레이션 완료!');
      }
    }
    
    console.log('모든 데이터 마이그레이션이 완료되었습니다!');
    
  } catch (error) {
    console.error('데이터 마이그레이션 중 오류 발생:', error);
  }
}

migrateData();
