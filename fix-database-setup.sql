-- 새 Supabase 프로젝트 데이터베이스 설정 수정
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. users 테이블 생성 (Admin 인증용)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- 2. product_gallery 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS product_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. product-images bucket 생성 (Storage용)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,  -- 공개 버킷으로 설정
  10485760,  -- 10MB 파일 크기 제한
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- 4. RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 설정
-- users 테이블: Admin만 접근 가능
CREATE POLICY "Admin can manage users" ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'yesminseo03@naver.com'
  )
);

-- product_gallery 테이블: 모든 사용자가 활성화된 갤러리 조회 가능
CREATE POLICY "Anyone can view active gallery" ON product_gallery
FOR SELECT
TO public
USING (is_active = true);

-- product_gallery 테이블: Admin만 갤러리 관리 가능
CREATE POLICY "Admin can manage gallery" ON product_gallery
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'yesminseo03@naver.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'yesminseo03@naver.com'
  )
);

-- 6. Storage RLS 정책 설정
-- 모든 사용자가 파일 다운로드 가능
CREATE POLICY "Allow public downloads from product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 인증된 사용자만 파일 업로드 가능
CREATE POLICY "Allow authenticated uploads to product-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 인증된 사용자만 파일 업데이트 가능
CREATE POLICY "Allow authenticated updates to product-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 인증된 사용자만 파일 삭제 가능
CREATE POLICY "Allow authenticated deletes from product-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 7. 설정 완료 확인
SELECT 
  'Tables created' as status,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'product_gallery')
ORDER BY table_name;

SELECT 
  'Storage bucket created' as status,
  id, name, public, file_size_limit
FROM storage.buckets 
WHERE id = 'product-images';

SELECT 
  'RLS policies created' as status,
  schemaname, tablename, policyname
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;
