import { createClient } from '@supabase/supabase-js';

// 새 Supabase 프로젝트 설정
const supabaseUrl = 'https://cktutvtbfrdnxkopeodj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseConnection() {
  console.log('🔍 새 Supabase 프로젝트 연결 확인 중...');
  
  try {
    // 1. product_gallery 테이블 존재 확인
    console.log('\n1. product_gallery 테이블 확인...');
    const { data: galleryData, error: galleryError } = await supabase
      .from('product_gallery')
      .select('*')
      .limit(1);
    
    if (galleryError) {
      console.error('❌ product_gallery 테이블 오류:', galleryError);
    } else {
      console.log('✅ product_gallery 테이블 접근 성공');
      console.log('📊 현재 데이터 개수:', galleryData?.length || 0);
    }
    
    // 2. users 테이블 존재 확인
    console.log('\n2. users 테이블 확인...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ users 테이블 오류:', usersError);
    } else {
      console.log('✅ users 테이블 접근 성공');
      console.log('📊 현재 데이터 개수:', usersData?.length || 0);
    }
    
    // 3. Storage bucket 확인
    console.log('\n3. Storage bucket 확인...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Storage bucket 오류:', bucketsError);
    } else {
      console.log('✅ Storage bucket 접근 성공');
      console.log('📦 사용 가능한 bucket:', buckets?.map(b => b.name) || []);
    }
    
    // 4. product-images bucket 확인
    console.log('\n4. product-images bucket 확인...');
    const { data: files, error: filesError } = await supabase.storage
      .from('product-images')
      .list();
    
    if (filesError) {
      console.error('❌ product-images bucket 오류:', filesError);
    } else {
      console.log('✅ product-images bucket 접근 성공');
      console.log('📁 파일 개수:', files?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ 전체 연결 확인 실패:', error);
  }
}

checkDatabaseConnection();
