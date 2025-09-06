-- 새 Supabase 프로젝트에서 Authentication 관련 RLS 정책 설정
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. users 테이블 RLS 정책 (기존 Drizzle 스키마용)
-- users 테이블이 있다면 RLS 활성화
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    
    -- Admin만 users 테이블에 접근 가능
    CREATE POLICY "Admin can manage users" ON users
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'yesminseo03@naver.com'
      )
    );
  END IF;
END $$;

-- 2. qna_submissions 테이블 RLS 정책 (현재 사용하지 않음 - 주석 처리)
-- DO $$
-- BEGIN
--   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qna_submissions') THEN
--     ALTER TABLE qna_submissions ENABLE ROW LEVEL SECURITY;
--     
--     -- 모든 사용자가 QNA 제출 가능
--     CREATE POLICY "Anyone can submit QNA" ON qna_submissions
--     FOR INSERT
--     TO public
--     WITH CHECK (true);
--     
--     -- 모든 사용자가 QNA 조회 가능 (답변이 있는 것만)
--     CREATE POLICY "Anyone can view answered QNA" ON qna_submissions
--     FOR SELECT
--     TO public
--     USING (is_answered = true);
--     
--     -- Admin만 모든 QNA 조회 가능
--     CREATE POLICY "Admin can view all QNA" ON qna_submissions
--     FOR SELECT
--     TO authenticated
--     USING (
--       EXISTS (
--         SELECT 1 FROM auth.users 
--         WHERE auth.users.id = auth.uid() 
--         AND auth.users.email = 'yesminseo03@naver.com'
--       )
--     );
--     
--     -- Admin만 QNA 답변 가능
--     CREATE POLICY "Admin can answer QNA" ON qna_submissions
--     FOR UPDATE
--     TO authenticated
--     USING (
--       EXISTS (
--         SELECT 1 FROM auth.users 
--         WHERE auth.users.id = auth.uid() 
--         AND auth.users.email = 'yesminseo03@naver.com'
--       )
--     )
--     WITH CHECK (
--       EXISTS (
--         SELECT 1 FROM auth.users 
--         WHERE auth.users.id = auth.uid() 
--         AND auth.users.email = 'yesminseo03@naver.com'
--       )
--     );
--   END IF;
-- END $$;

-- 2. product_gallery 테이블 RLS 정책
-- product_gallery 테이블이 있다면 RLS 활성화
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_gallery') THEN
    ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;
    
    -- 모든 사용자가 활성화된 갤러리 조회 가능
    CREATE POLICY "Anyone can view active gallery" ON product_gallery
    FOR SELECT
    TO public
    USING (is_active = true);
    
    -- Admin만 갤러리 관리 가능
    CREATE POLICY "Admin can manage gallery" ON product_gallery
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'yesminseo03@naver.com'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'yesminseo03@naver.com'
      )
    );
  END IF;
END $$;

-- 3. RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
