# 🚨 Admin 이미지 업로드 권한 문제 해결

## 🔍 문제 원인
Admin에서 이미지 업로드 시 `permission denied for table users` 오류가 발생하는 이유:

1. **RLS 정책이 `users` 테이블을 참조**하고 있음
2. **`users` 테이블이 존재하지 않음** (Supabase Auth 사용)
3. **Admin 인증은 Supabase Auth**를 사용하므로 별도 `users` 테이블 불필요

## 🛠️ 해결 방법

### 1단계: RLS 정책 수정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 **`fix-rls-policies.sql`** 실행

이 스크립트는 다음을 수행합니다:
- 기존 `users` 테이블 참조하는 RLS 정책 삭제
- `product_gallery` 테이블 RLS 정책을 Supabase Auth 기반으로 재설정
- Storage RLS 정책 재설정

### 2단계: Admin 계정 생성 (아직 안 했다면)
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 **`create-admin-user.sql`** 실행

### 3단계: 테스트
1. 브라우저에서 `http://localhost:3001/admin-login` 접속
2. `yesminseo03@naver.com` / `test1234`로 로그인
3. Admin 페이지에서 이미지 업로드 테스트

## 🔧 변경된 RLS 정책

### Before (문제가 있던 정책):
```sql
-- users 테이블을 참조하는 정책 (users 테이블이 없어서 오류)
CREATE POLICY "Admin can manage gallery" ON product_gallery
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'yesminseo03@naver.com'
  )
);
```

### After (수정된 정책):
```sql
-- 인증된 사용자라면 누구나 갤러리 관리 가능
CREATE POLICY "Authenticated users can manage gallery" ON product_gallery
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

## ⚠️ 보안 고려사항

현재 설정은 **개발 환경용**입니다:
- 인증된 사용자라면 누구나 갤러리 관리 가능
- 프로덕션에서는 더 엄격한 정책 필요

### 프로덕션용 정책 (선택사항):
```sql
-- 특정 이메일만 관리 가능하도록 제한
CREATE POLICY "Admin email only" ON product_gallery
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'yesminseo03@naver.com'
)
WITH CHECK (
  auth.jwt() ->> 'email' = 'yesminseo03@naver.com'
);
```

## 📞 문제가 지속될 경우

1. **브라우저 개발자 도구** → Console 탭에서 오류 메시지 확인
2. **Supabase Dashboard** → Logs에서 서버 오류 확인
3. **Admin 로그인 상태** 확인
