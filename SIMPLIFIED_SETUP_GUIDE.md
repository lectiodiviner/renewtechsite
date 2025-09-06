# 🚀 새 Supabase 프로젝트 간소화 설정 가이드

## 📋 실행 순서 (QNA 제외)

### 1단계: 테이블 생성
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `create-tables.sql` 실행
- `users` 테이블 생성
- `product_gallery` 테이블 생성
- QNA 관련 테이블은 주석 처리됨

### 2단계: Admin 계정 생성
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `create-admin-user.sql` 실행

### 3단계: RLS 정책 설정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `setup-auth-rls.sql` 실행
- `users` 테이블 RLS 정책
- `product_gallery` 테이블 RLS 정책
- QNA 관련 정책은 주석 처리됨

### 4단계: Storage 설정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 `setup-storage-rls.sql` 실행

## 🔐 Admin 계정 정보
- **이메일**: `yesminseo03@naver.com`
- **비밀번호**: `test1234`

## 🌐 접속 정보
- **개발 서버**: `http://localhost:3001`
- **Admin 로그인**: `http://localhost:3001/admin-login`
- **Admin 대시보드**: `http://localhost:3001/admin`

## 📝 현재 구현된 기능
- ✅ **Product Gallery**: 이미지 갤러리 관리
- ✅ **Admin Authentication**: Supabase Auth 기반 로그인
- ✅ **Storage**: 이미지 업로드 및 관리
- ❌ **QNA**: 현재 구현되지 않음 (주석 처리)

## ⚠️ 중요 사항
1. **순서 준수**: 반드시 1단계부터 순서대로 실행하세요
2. **QNA 제외**: QNA 관련 테이블과 정책은 주석 처리되어 있습니다
3. **오류 확인**: 각 단계 실행 후 오류가 없는지 확인하세요

## 🔧 문제 해결

### "relation does not exist" 오류
- 1단계 `create-tables.sql`을 먼저 실행하세요

### 로그인 실패
- Admin 계정이 생성되었는지 확인하세요
- 이메일과 비밀번호를 정확히 입력하세요

### RLS 정책 오류
- 테이블이 먼저 생성되었는지 확인하세요
- 3단계 `setup-auth-rls.sql`을 다시 실행하세요
