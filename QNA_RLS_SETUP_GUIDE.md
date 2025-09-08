# Q&A 테이블 RLS 정책 설정 가이드

`qna_submissions` 테이블에 대한 Row Level Security (RLS) 정책을 설정하는 방법을 안내합니다.

## 📋 개요

RLS 정책은 데이터베이스 레벨에서 접근 권한을 제어하여 보안을 강화합니다. Q&A 시스템에서는 다음과 같은 권한이 필요합니다:

- **일반 사용자**: 문의 제출만 가능
- **관리자**: 모든 문의 조회, 답변 작성, 삭제 가능

## 🚀 설정 방법

### 방법 1: 기본 RLS 정책 (권장)

가장 간단하고 안전한 설정입니다.

1. Supabase 대시보드 → SQL Editor로 이동
2. `setup-qna-rls-policies.sql` 파일의 내용을 복사하여 실행

```sql
-- 이 파일의 전체 내용을 SQL Editor에서 실행
```

**특징:**
- 모든 사용자가 문의 제출 가능
- 인증된 사용자(관리자)만 문의 조회/답변/삭제 가능
- 간단하고 안정적

### 방법 2: 고급 RLS 정책 (선택사항)

관리자 이메일을 기반으로 한 더 엄격한 권한 제어입니다.

1. Supabase 대시보드 → SQL Editor로 이동
2. `setup-qna-rls-policies-advanced.sql` 파일의 내용을 복사하여 실행

**특징:**
- 특정 관리자 이메일(`yesminseo03@naver.com`)만 접근 가능
- 더 엄격한 보안
- 관리자 함수를 사용하여 권한 확인

## 🔧 정책 상세 설명

### 기본 정책들

1. **문의 제출 (INSERT)**
   ```sql
   CREATE POLICY "Anyone can submit questions" ON qna_submissions
   FOR INSERT TO public WITH CHECK (true);
   ```
   - 모든 사용자가 문의를 제출할 수 있습니다

2. **문의 조회 (SELECT)**
   ```sql
   CREATE POLICY "Authenticated users can view all questions" ON qna_submissions
   FOR SELECT TO authenticated USING (true);
   ```
   - 인증된 사용자만 문의 목록을 볼 수 있습니다

3. **답변 작성 (UPDATE)**
   ```sql
   CREATE POLICY "Authenticated users can answer questions" ON qna_submissions
   FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
   ```
   - 인증된 사용자만 답변을 작성할 수 있습니다

4. **문의 삭제 (DELETE)**
   ```sql
   CREATE POLICY "Authenticated users can delete questions" ON qna_submissions
   FOR DELETE TO authenticated USING (true);
   ```
   - 인증된 사용자만 문의를 삭제할 수 있습니다

## ✅ 설정 확인

SQL 실행 후 다음 쿼리로 정책이 올바르게 생성되었는지 확인할 수 있습니다:

```sql
-- RLS 정책 확인
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'qna_submissions'
ORDER BY policyname;
```

예상 결과:
- Anyone can submit questions (INSERT)
- Authenticated users can view all questions (SELECT)
- Authenticated users can answer questions (UPDATE)
- Authenticated users can delete questions (DELETE)

## 🔍 문제 해결

### 문제 1: 문의 제출이 안 되는 경우

**원인:** RLS가 활성화되었지만 INSERT 정책이 없음

**해결방법:**
```sql
-- INSERT 정책 확인
SELECT policyname FROM pg_policies 
WHERE tablename = 'qna_submissions' AND cmd = 'INSERT';

-- 정책이 없다면 추가
CREATE POLICY "Anyone can submit questions" ON qna_submissions
FOR INSERT TO public WITH CHECK (true);
```

### 문제 2: 관리자 페이지에서 문의가 보이지 않는 경우

**원인:** SELECT 정책이 없거나 인증되지 않음

**해결방법:**
1. 관리자 로그인 상태 확인
2. SELECT 정책 확인:
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'qna_submissions' AND cmd = 'SELECT';
```

### 문제 3: 답변 작성이 안 되는 경우

**원인:** UPDATE 정책이 없음

**해결방법:**
```sql
-- UPDATE 정책 확인 및 추가
CREATE POLICY "Authenticated users can answer questions" ON qna_submissions
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

## 🛡️ 보안 고려사항

1. **정기적인 권한 검토**: 정책이 올바르게 작동하는지 정기적으로 확인
2. **로그 모니터링**: Supabase 대시보드에서 접근 로그 모니터링
3. **백업**: 정책 설정 전 현재 설정을 백업

## 📝 추가 설정

### 관리자 이메일 변경

고급 정책을 사용하는 경우, 관리자 이메일을 변경하려면:

```sql
-- 함수 수정
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.email = '새로운-관리자-이메일@example.com'
    AND auth.users.id = auth.uid()
  );
$$;
```

### 정책 삭제

모든 정책을 삭제하려면:

```sql
-- 모든 정책 삭제
DROP POLICY IF EXISTS "Anyone can submit questions" ON qna_submissions;
DROP POLICY IF EXISTS "Authenticated users can view all questions" ON qna_submissions;
DROP POLICY IF EXISTS "Authenticated users can answer questions" ON qna_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete questions" ON qna_submissions;

-- RLS 비활성화
ALTER TABLE qna_submissions DISABLE ROW LEVEL SECURITY;
```

## 🎯 권장사항

1. **기본 정책 사용**: 처음에는 `setup-qna-rls-policies.sql` 사용
2. **단계적 적용**: 정책을 하나씩 적용하여 테스트
3. **백업 유지**: 설정 변경 전 항상 백업
4. **모니터링**: 정책 적용 후 기능이 정상 작동하는지 확인
