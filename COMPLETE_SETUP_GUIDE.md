# 🚀 새 Supabase 프로젝트 완전 설정 가이드

## 📋 실행 순서

### 1단계: 테이블 생성
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `create-tables.sql` 실행

### 2단계: Admin 계정 생성
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `create-admin-user.sql` 실행

### 3단계: RLS 정책 설정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `setup-auth-rls.sql` 실행

### 4단계: Storage 설정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `setup-storage-rls.sql` 실행

### 5단계: 데이터 마이그레이션 (선택사항)
기존 데이터가 있다면:
1. `backup-data.js` 실행하여 데이터 백업
2. `migrate-data.js` 실행하여 새 프로젝트로 데이터 이전

## 🔐 Admin 계정 정보
- **이메일**: `yesminseo03@naver.com`
- **비밀번호**: `test1234`

## 🌐 접속 정보
- **개발 서버**: `http://localhost:3001`
- **Admin 로그인**: `http://localhost:3001/admin-login`
- **Admin 대시보드**: `http://localhost:3001/admin`

## ⚠️ 중요 사항
1. **순서 준수**: 반드시 1단계부터 순서대로 실행하세요
2. **오류 확인**: 각 단계 실행 후 오류가 없는지 확인하세요
3. **테이블 확인**: 1단계 후 테이블이 생성되었는지 확인하세요

## 🔧 문제 해결

### "relation does not exist" 오류
- 1단계 `create-tables.sql`을 먼저 실행하세요

### 로그인 실패
- Admin 계정이 생성되었는지 확인하세요
- 이메일과 비밀번호를 정확히 입력하세요

### RLS 정책 오류
- 테이블이 먼저 생성되었는지 확인하세요
- 3단계 `setup-auth-rls.sql`을 다시 실행하세요
