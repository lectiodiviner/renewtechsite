-- Q&A 테이블 고급 RLS 정책 설정 (관리자 이메일 기반)
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. qna_submissions 테이블의 기존 RLS 정책 삭제 (안전하게)
DO $$
BEGIN
  -- qna_submissions 테이블이 존재하는지 확인
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qna_submissions') THEN
    -- 기존 정책들 삭제
    DROP POLICY IF EXISTS "Anyone can submit questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Admin can view all questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Admin can answer questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Admin can delete questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Authenticated users can view all questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Authenticated users can answer questions" ON qna_submissions;
    DROP POLICY IF EXISTS "Authenticated users can delete questions" ON qna_submissions;
    
    RAISE NOTICE 'qna_submissions 테이블의 기존 RLS 정책을 삭제했습니다.';
  ELSE
    RAISE NOTICE 'qna_submissions 테이블이 존재하지 않습니다.';
  END IF;
END $$;

-- 2. qna_submissions 테이블 RLS 활성화
ALTER TABLE qna_submissions ENABLE ROW LEVEL SECURITY;

-- 3. 관리자 이메일 확인을 위한 함수 생성 (선택사항)
-- 이 함수는 auth.users 테이블에서 관리자 이메일을 확인합니다
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.email = 'yesminseo03@naver.com'  -- 관리자 이메일
    AND auth.users.id = auth.uid()
  );
$$;

-- 4. RLS 정책 생성

-- 4.1 모든 사용자가 문의 제출 가능 (INSERT)
CREATE POLICY "Anyone can submit questions" ON qna_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- 4.2 관리자만 모든 문의 조회 가능 (SELECT)
CREATE POLICY "Admin can view all questions" ON qna_submissions
FOR SELECT
TO authenticated
USING (is_admin_user());

-- 4.3 관리자만 문의에 답변 가능 (UPDATE)
CREATE POLICY "Admin can answer questions" ON qna_submissions
FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 4.4 관리자만 문의 삭제 가능 (DELETE)
CREATE POLICY "Admin can delete questions" ON qna_submissions
FOR DELETE
TO authenticated
USING (is_admin_user());

-- 5. 대안: 더 간단한 인증된 사용자 정책 (관리자 함수 없이)
-- 위의 정책들이 작동하지 않는 경우 아래 정책들을 사용하세요

/*
-- 5.1 인증된 사용자만 모든 문의 조회 가능
CREATE POLICY "Authenticated users can view all questions" ON qna_submissions
FOR SELECT
TO authenticated
USING (true);

-- 5.2 인증된 사용자만 문의에 답변 가능
CREATE POLICY "Authenticated users can answer questions" ON qna_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5.3 인증된 사용자만 문의 삭제 가능
CREATE POLICY "Authenticated users can delete questions" ON qna_submissions
FOR DELETE
TO authenticated
USING (true);
*/

-- 6. 정책 확인
SELECT 
  'Q&A Advanced RLS policies created' as status,
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'qna_submissions'
ORDER BY policyname;

-- 7. 함수 확인
SELECT 
  'Admin function created' as status,
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'is_admin_user'
AND routine_schema = 'public';

-- 8. 테이블 권한 확인
SELECT 
  'Table permissions' as info,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_name = 'qna_submissions'
AND table_schema = 'public'
ORDER BY privilege_type, grantee;
