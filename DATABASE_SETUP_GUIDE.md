# 데이터베이스 연결 설정 가이드

Q&A 시스템이 실제 Supabase 데이터베이스와 연결되도록 설정하는 방법을 안내합니다.

## 🚨 문제 상황

현재 Q&A 폼에서 데이터를 제출하면:
- ✅ Admin 페이지에서는 문의가 조회됨 (메모리 스토리지)
- ❌ `qna_submissions` 테이블에는 데이터가 저장되지 않음

이는 메모리 스토리지와 실제 데이터베이스 간의 불일치 때문입니다.

## 🔧 해결 방법

### 1. Supabase 데이터베이스 연결 정보 확인

1. **Supabase 대시보드** → **Settings** → **Database**로 이동
2. **Connection string** 섹션에서 **URI** 복사
3. 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.cktutvtbfrdnxkopeodj.supabase.co:5432/postgres`

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://cktutvtbfrdnxkopeodj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU

# 데이터베이스 연결 (실제 비밀번호로 변경 필요)
DATABASE_URL=postgresql://postgres:[YOUR-ACTUAL-PASSWORD]@db.cktutvtbfrdnxkopeodj.supabase.co:5432/postgres

# Admin 계정
VITE_ADMIN_EMAIL=yesminseo03@naver.com

# 이메일 발송 설정 (선택사항)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# 포트 설정
PORT=3000
```

### 3. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- qna_submissions 테이블 생성
CREATE TABLE IF NOT EXISTS qna_submissions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE
);
```

### 4. RLS 정책 설정

`setup-qna-rls-policies.sql` 파일의 내용을 Supabase SQL Editor에서 실행하세요.

### 5. 서버 재시작

환경변수 설정 후 서버를 재시작하세요:

```bash
npm run dev
```

## ✅ 확인 방법

### 1. 데이터베이스 연결 테스트

서버 콘솔에서 다음과 같은 메시지가 나타나야 합니다:
- "serving on port 3000" (또는 설정한 포트)
- 데이터베이스 연결 오류가 없어야 함

### 2. Q&A 폼 테스트

1. 홈페이지에서 Q&A 폼에 테스트 문의 제출
2. Supabase 대시보드 → **Table Editor** → **qna_submissions** 테이블 확인
3. 데이터가 실제로 저장되었는지 확인

### 3. Admin 페이지 테스트

1. Admin 페이지에서 Q&A Management 탭 확인
2. 제출한 문의가 목록에 표시되는지 확인
3. 답변 작성 후 이메일 발송 확인

## 🔍 문제 해결

### 문제 1: "DATABASE_URL must be set" 오류

**원인:** 환경변수 파일이 없거나 DATABASE_URL이 설정되지 않음

**해결방법:**
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. DATABASE_URL이 올바르게 설정되었는지 확인
3. 서버 재시작

### 문제 2: "relation 'qna_submissions' does not exist" 오류

**원인:** 데이터베이스 테이블이 생성되지 않음

**해결방법:**
1. `create-tables.sql` 파일을 Supabase SQL Editor에서 실행
2. 테이블이 생성되었는지 확인

### 문제 3: "permission denied" 오류

**원인:** RLS 정책이 설정되지 않음

**해결방법:**
1. `setup-qna-rls-policies.sql` 파일을 Supabase SQL Editor에서 실행
2. 정책이 올바르게 생성되었는지 확인

### 문제 4: 데이터는 저장되지만 Admin에서 조회되지 않음

**원인:** RLS 정책으로 인한 접근 권한 문제

**해결방법:**
1. Admin 로그인 상태 확인
2. RLS 정책에서 authenticated 사용자 권한 확인

## 📝 추가 설정

### 데이터베이스 연결 풀 설정

대용량 트래픽을 처리하기 위해 연결 풀을 설정할 수 있습니다:

```env
# 연결 풀 설정 (선택사항)
DATABASE_POOL_SIZE=10
DATABASE_POOL_TIMEOUT=30000
```

### 로깅 설정

개발 환경에서 데이터베이스 쿼리를 로깅하려면:

```env
# 개발 환경에서만 사용
DEBUG_DB=true
```

## 🚀 배포 시 주의사항

### Vercel 배포

1. Vercel 대시보드에서 환경변수 설정
2. DATABASE_URL을 Vercel 환경변수로 추가
3. 빌드 및 배포

### 기타 플랫폼

각 플랫폼의 환경변수 설정 방법에 따라 DATABASE_URL을 설정하세요.

## 📞 지원

문제가 지속되면 다음을 확인하세요:

1. Supabase 프로젝트 상태
2. 데이터베이스 연결 정보
3. 환경변수 설정
4. 서버 로그 메시지
