-- Q&A 테이블 RLS 정책 설정
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. qna_submissions 테이블의 기존 RLS 정책 삭제 (안전하게)
DO $$
BEGIN
  -- qna_submissions 테이블이 존재하는지 확인
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qna_submissions') THEN
    -- 기존 정책들 삭제
    DROP POLICY IF EXISTS "Anyone can submit questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Authenticated users can view all questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Authenticated users can answer questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Admin can manage all questions" ON qna_submissions;
    
    RAISE NOTICE 'qna_submissions 테이블의 기존 RLS 정책을 삭제했습니다.';
  ELSE
    RAISE NOTICE 'qna_submissions 테이블이 존재하지 않습니다.';
  END IF;
END $$;

-- 2. qna_submissions 테이블 RLS 활성화
ALTER TABLE qna_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 생성

-- 3.1 모든 사용자가 문의 제출 가능 (INSERT)
CREATE POLICY "Anyone can submit questions" ON qna_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- 3.2 인증된 사용자(관리자)만 모든 문의 조회 가능 (SELECT)
CREATE POLICY "Authenticated users can view all questions" ON qna_submissions
FOR SELECT
TO authenticated
USING (true);

-- 3.3 인증된 사용자(관리자)만 문의에 답변 가능 (UPDATE)
CREATE POLICY "Authenticated users can answer questions" ON qna_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3.4 인증된 사용자(관리자)만 문의 삭제 가능 (DELETE) - 선택사항
CREATE POLICY "Authenticated users can delete questions" ON qna_submissions
FOR DELETE
TO authenticated
USING (true);

-- 4. 정책 확인
SELECT 
  'Q&A RLS policies created' as status,
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'qna_submissions'
ORDER BY policyname;

-- 5. 테이블 권한 확인
SELECT 
  'Table permissions' as info,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_name = 'qna_submissions'
AND table_schema = 'public'
ORDER BY privilege_type, grantee;
