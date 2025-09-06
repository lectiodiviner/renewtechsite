-- 새 Supabase 프로젝트에서 필요한 테이블들 생성
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. users 테이블 생성 (Drizzle 스키마용)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- 2. qna_submissions 테이블 생성 (현재 사용하지 않음 - 주석 처리)
-- CREATE TABLE IF NOT EXISTS qna_submissions (
--   id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   email TEXT NOT NULL,
--   question TEXT NOT NULL,
--   answer TEXT,
--   is_answered BOOLEAN DEFAULT false NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
--   answered_at TIMESTAMP WITH TIME ZONE
-- );

-- 3. product_gallery 테이블 생성
CREATE TABLE IF NOT EXISTS product_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 테이블 생성 확인
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'product_gallery')
ORDER BY table_name;
