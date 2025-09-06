# Supabase 프로젝트 마이그레이션 가이드

## 1단계: 기존 데이터 백업
```bash
node backup-data.js
```

## 2단계: 새 Supabase 프로젝트 생성
1. https://supabase.com/dashboard 접속
2. "New Project" 클릭
3. 프로젝트 설정 완료 후 대기

## 3단계: 새 프로젝트 정보 확인
- Project URL
- API Key (anon public)
- Database URL

## 4단계: 스키마 생성
새 Supabase 프로젝트의 SQL Editor에서 다음 SQL 실행:

```sql
-- Users 테이블
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- QNA Submissions 테이블
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
```

## 5단계: 마이그레이션 스크립트 설정
`migrate-data.js` 파일에서 다음 값들을 새 프로젝트 정보로 교체:
- `YOUR_NEW_SUPABASE_URL`
- `YOUR_NEW_SUPABASE_ANON_KEY`

## 6단계: 데이터 마이그레이션 실행
```bash
node migrate-data.js
```

## 7단계: 환경 변수 업데이트
`env.new.example` 파일을 참고하여 `.env` 파일을 새 프로젝트 정보로 업데이트

## 8단계: 애플리케이션 테스트
```bash
npm run dev
```

## 9단계: 정리
마이그레이션 완료 후 다음 파일들 삭제:
- `backup-data.js`
- `migrate-schema.js`
- `migrate-data.js`
- `backup-users.json`
- `backup-qna-submissions.json`
- `env.new.example`
- `MIGRATION_STEPS.md`
