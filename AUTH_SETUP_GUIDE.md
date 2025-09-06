# 🔐 새 Supabase 프로젝트 Authentication 설정 가이드

## 1단계: Supabase Dashboard에서 Authentication 설정

### 1.1 Authentication Providers 설정
1. [Supabase Dashboard](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/providers) 접속
2. **Email** 탭에서 다음 설정:
   - ✅ **Enable email confirmations**: 비활성화 (개발용)
   - ✅ **Enable email change confirmations**: 비활성화 (개발용)
   - ✅ **Enable email change**: 활성화
   - ✅ **Enable password reset**: 활성화

### 1.2 Authentication Settings
1. [Authentication Settings](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/settings) 접속
2. 다음 설정 확인:
   - **Site URL**: `http://localhost:3001` (개발용)
   - **Redirect URLs**: `http://localhost:3001/**`
   - **JWT expiry**: 3600 (1시간)

## 2단계: Admin 계정 생성

### 방법 1: SQL을 통한 생성 (권장)
1. [SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql) 접속
2. `create-admin-user.sql` 파일의 내용을 복사하여 실행
3. 생성된 계정 정보:
   - **이메일**: `yesminseo03@naver.com`
   - **비밀번호**: `test1234`

### 방법 2: Dashboard를 통한 생성
1. [Authentication > Users](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/users) 접속
2. **Add user** 클릭
3. 다음 정보 입력:
   - **Email**: `yesminseo03@naver.com`
   - **Password**: `test1234`
   - **Email Confirm**: ✅ 체크

## 3단계: RLS 정책 설정

1. [SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql) 접속
2. `setup-auth-rls.sql` 파일의 내용을 복사하여 실행
3. 다음 정책들이 생성됩니다:
   - **users 테이블**: Admin만 접근 가능
   - **qna_submissions 테이블**: 
     - 모든 사용자: 제출 및 답변된 QNA 조회
     - Admin: 모든 QNA 조회 및 답변
   - **product_gallery 테이블**:
     - 모든 사용자: 활성화된 갤러리 조회
     - Admin: 갤러리 관리

## 4단계: Storage RLS 정책 설정

1. [SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql) 접속
2. `setup-storage-rls.sql` 파일의 내용을 복사하여 실행
3. `product-images` bucket이 생성되고 RLS 정책이 설정됩니다

## 5단계: 테스트

### 5.1 Admin 로그인 테스트
1. 브라우저에서 `http://localhost:3001/admin-login` 접속
2. 다음 정보로 로그인:
   - **이메일**: `yesminseo03@naver.com`
   - **비밀번호**: `test1234`
3. 로그인 성공 시 `/admin` 페이지로 리다이렉트

### 5.2 기능 테스트
1. **Admin Dashboard**: `/admin` 페이지에서 갤러리 관리 기능 확인
2. **QNA 관리**: QNA 제출 및 답변 기능 확인
3. **Storage 업로드**: 이미지 업로드 기능 확인

## 6단계: 보안 설정 (선택사항)

### 6.1 비밀번호 정책 강화
1. [Authentication Settings](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/settings) 접속
2. **Password Requirements** 설정:
   - 최소 길이: 8자
   - 대문자, 소문자, 숫자, 특수문자 포함

### 6.2 이메일 확인 활성화 (프로덕션용)
1. **Enable email confirmations**: 활성화
2. **Enable email change confirmations**: 활성화

## 🔧 문제 해결

### 로그인 실패 시
1. **이메일 확인**: `yesminseo03@naver.com` 정확히 입력
2. **비밀번호 확인**: 대소문자 구분
3. **사용자 존재 확인**: [Users 페이지](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/users)에서 확인

### RLS 정책 오류 시
1. **정책 확인**: [RLS 페이지](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/auth/policies)에서 확인
2. **SQL 재실행**: `setup-auth-rls.sql` 다시 실행

### Storage 접근 오류 시
1. **Bucket 확인**: [Storage 페이지](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/storage/buckets)에서 확인
2. **RLS 정책 확인**: Storage RLS 정책 재설정

## 📞 지원

문제가 발생하면:
1. Supabase Dashboard의 로그 확인
2. 브라우저 개발자 도구의 콘솔 확인
3. 네트워크 탭에서 API 요청 확인
