import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// 현재 Supabase 설정
const supabaseUrl = 'https://cktutvtbfrdnxkopeodj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function backupData() {
  try {
    console.log('데이터 백업을 시작합니다...');
    
    // users 테이블 백업
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('Users 테이블 백업 실패:', usersError);
    } else {
      console.log(`Users 테이블: ${users.length}개 레코드 백업 완료`);
      fs.writeFileSync('backup-users.json', JSON.stringify(users, null, 2));
    }
    
    // qna_submissions 테이블 백업
    const { data: qnaSubmissions, error: qnaError } = await supabase
      .from('qna_submissions')
      .select('*');
    
    if (qnaError) {
      console.error('QNA Submissions 테이블 백업 실패:', qnaError);
    } else {
      console.log(`QNA Submissions 테이블: ${qnaSubmissions.length}개 레코드 백업 완료`);
      fs.writeFileSync('backup-qna-submissions.json', JSON.stringify(qnaSubmissions, null, 2));
    }
    
    console.log('데이터 백업이 완료되었습니다!');
    console.log('백업 파일:');
    console.log('- backup-users.json');
    console.log('- backup-qna-submissions.json');
    
  } catch (error) {
    console.error('백업 중 오류 발생:', error);
  }
}

backupData();
