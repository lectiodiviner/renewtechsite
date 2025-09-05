# 🚀 기존 이미지 Supabase 마이그레이션 가이드

## 📋 개요
기존에 하드코딩되어 있던 Product Gallery 이미지들을 Supabase로 마이그레이션하여 Admin 페이지에서 관리할 수 있도록 합니다.

## 🎯 마이그레이션 대상 이미지

### 1. Recycled Kraft Paper Shopping Bag (3개)
- **Nature**: `KakaoTalk_20250821_115422394_01_1755766655585.jpg` (9.7MB)
- **Lakeside**: `KakaoTalk_20250821_115422394_07_1755766655585.jpg` (9.8MB)
- **Urban**: `KakaoTalk_20250821_115422394_12_1755766655586.jpg` (9.9MB)

### 2. Biodegradable Shopping Bag (3개)
- **Style 1**: `KakaoTalk_20250825_121348376_1756109054508.png` (636KB)
- **Style 2**: `KakaoTalk_20250825_121524132_1756109054509.png` (444KB)
- **Style 3**: `KakaoTalk_20250825_121631471_1756109054509.png` (1.1MB)

### 3. Waterproof Paper Product (1개)
- **Waterproof**: `KakaoTalk_20250825_205747637_1756123331624.png` (156KB)

## 🔧 마이그레이션 방법

### 방법 1: Admin 페이지를 통한 수동 업로드 (권장)

1. **Admin 페이지 접속**
   - `/admin-login`에서 Supabase 계정으로 로그인
   - `/admin` 페이지로 이동

2. **이미지 업로드**
   - "Product Gallery" 탭 선택
   - "미디어 업로드" 버튼 클릭
   - 각 이미지 파일을 선택하고 정보 입력:
     - **제목**: 위의 제목 사용
     - **설명**: "Comfort for you. Relief for the Earth."
     - **미디어 타입**: "이미지" 선택
     - **파일**: 해당 이미지 파일 선택

3. **업로드 순서**
   - Recycled Kraft Paper Shopping Bag (3개)
   - Biodegradable Shopping Bag (3개)
   - Waterproof Paper Product (1개)

### 방법 2: SQL 스크립트를 통한 직접 삽입

1. **Supabase SQL Editor 접속**
   - Supabase Dashboard → SQL Editor

2. **SQL 스크립트 실행**
   ```sql
   -- migrate-images-sql.sql 파일의 내용을 복사하여 실행
   ```

3. **주의사항**
   - Storage에 실제 파일이 업로드되어 있어야 함
   - RLS 정책이 적절히 설정되어 있어야 함

## 📁 파일 구조

```
RenewTechSite/
├── attached_assets/           # 원본 이미지 파일들
│   ├── KakaoTalk_20250821_*.jpg
│   └── KakaoTalk_20250825_*.png
├── public/images/             # 공개 접근용 이미지들 (복사됨)
├── migrate-images.js          # Node.js 마이그레이션 스크립트
├── migrate-images-sql.sql     # SQL 마이그레이션 스크립트
└── MIGRATION_GUIDE.md        # 이 가이드 문서
```

## ⚠️ 주의사항

### 1. RLS (Row Level Security) 정책
- Supabase Storage의 RLS 정책이 업로드를 차단할 수 있음
- Admin 계정으로 로그인 후 업로드해야 함

### 2. 파일 크기 제한
- 이미지: 최대 10MB
- 영상: 최대 50MB
- 모든 이미지가 제한 내에 있음

### 3. 중복 방지
- 마이그레이션 전 기존 데이터 확인
- 동일한 제목의 이미지가 있는지 확인

## ✅ 마이그레이션 완료 확인

1. **Admin 페이지에서 확인**
   - `/admin` → Product Gallery 탭
   - 총 7개의 이미지가 표시되는지 확인

2. **메인 페이지에서 확인**
   - `/` → Eco Product Gallery
   - 이미지들이 정상적으로 표시되는지 확인
   - 설명 텍스트가 올바르게 표시되는지 확인

3. **데이터베이스 확인**
   - Supabase Dashboard → Table Editor
   - `product_gallery` 테이블에 7개 레코드 확인

## 🔄 롤백 방법

마이그레이션에 문제가 있을 경우:

1. **Admin 페이지에서 삭제**
   - 각 이미지를 개별적으로 삭제

2. **SQL로 일괄 삭제**
   ```sql
   DELETE FROM product_gallery WHERE title LIKE '%migrated%';
   ```

3. **코드 복원**
   - `home.tsx`에서 기존 이미지 import 복원
   - 하드코딩된 이미지 배열 복원

## 📞 지원

마이그레이션 중 문제가 발생하면:
- Admin 페이지에서 직접 업로드 시도
- Supabase Dashboard에서 RLS 정책 확인
- 브라우저 콘솔에서 에러 메시지 확인

---

**마이그레이션 완료 후**: 모든 이미지가 Supabase를 통해 관리되며, Admin 페이지에서 CRUD 작업이 가능합니다! 🎉
