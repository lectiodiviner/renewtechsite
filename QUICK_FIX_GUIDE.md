# 🚨 Admin 화면 DB 연결 문제 해결 가이드

## 🔍 문제 진단 결과

새 Supabase 프로젝트에서 다음 문제들이 발견되었습니다:

1. ✅ **product_gallery 테이블**: 존재함 (데이터 1개)
2. ❌ **users 테이블**: 존재하지 않음
3. ❌ **Storage bucket**: 비어있음 (product-images bucket 없음)
4. ❌ **RLS 정책**: 설정되지 않음

## 🛠️ 해결 방법

### 1단계: 데이터베이스 설정 수정
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 **`fix-database-setup.sql`** 실행

이 스크립트는 다음을 수행합니다:
- `users` 테이블 생성
- `product_gallery` 테이블 확인/생성
- `product-images` Storage bucket 생성
- 모든 RLS 정책 설정

### 2단계: Admin 계정 생성
[SQL Editor](https://supabase.com/dashboard/project/cktutvtbfrdnxkopeodj/sql)에서 **`create-admin-user.sql`** 실행

### 3단계: 연결 확인
터미널에서 다음 명령어 실행:
```bash
node check-db-connection.js
```

모든 항목이 ✅로 표시되어야 합니다.

### 4단계: Admin 페이지 테스트
1. 브라우저에서 `http://localhost:3001/admin-login` 접속
2. `yesminseo03@naver.com` / `test1234`로 로그인
3. Admin 페이지에서 Product Gallery 데이터 확인

## 🔧 문제 해결 체크리스트

- [ ] `fix-database-setup.sql` 실행 완료
- [ ] `create-admin-user.sql` 실행 완료
- [ ] `check-db-connection.js` 모든 항목 ✅
- [ ] Admin 로그인 성공
- [ ] Product Gallery 데이터 표시 확인

## 📞 문제가 지속될 경우

1. **브라우저 개발자 도구** → Console 탭에서 오류 메시지 확인
2. **Network 탭**에서 API 요청 상태 확인
3. **Supabase Dashboard** → Logs에서 서버 오류 확인

## ⚠️ 중요 사항

- 반드시 **1단계부터 순서대로** 실행하세요
- 각 단계 완료 후 **오류가 없는지** 확인하세요
- Admin 계정 생성은 **2단계에서** 별도로 실행하세요
