-- 새 Supabase 프로젝트에서 product-images bucket과 RLS 정책 설정
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. product-images bucket 생성 (공개 버킷으로 설정)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,  -- 공개 버킷으로 설정 (누구나 다운로드 가능)
  10485760,  -- 10MB 파일 크기 제한
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
);

-- 2. product_gallery 테이블 생성 (이미 있다면 스킵)
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

-- 3. product_gallery 테이블 RLS 활성화
ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;

-- 4. product_gallery 테이블 RLS 정책
-- 모든 사용자가 읽기 가능 (공개 갤러리)
CREATE POLICY "Allow public read access to product_gallery"
ON product_gallery
FOR SELECT
TO public
USING (is_active = true);

-- 인증된 사용자만 삽입 가능 (Admin 업로드)
CREATE POLICY "Allow authenticated insert to product_gallery"
ON product_gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 인증된 사용자만 업데이트 가능 (Admin 수정)
CREATE POLICY "Allow authenticated update to product_gallery"
ON product_gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 인증된 사용자만 삭제 가능 (Admin 삭제)
CREATE POLICY "Allow authenticated delete to product_gallery"
ON product_gallery
FOR DELETE
TO authenticated
USING (true);

-- 5. storage.objects 테이블 RLS 정책 (product-images bucket용)
-- 모든 사용자가 파일 다운로드 가능 (공개 버킷)
CREATE POLICY "Allow public downloads from product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 인증된 사용자만 파일 업로드 가능 (Admin 업로드)
CREATE POLICY "Allow authenticated uploads to product-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 인증된 사용자만 파일 업데이트 가능 (Admin 수정)
CREATE POLICY "Allow authenticated updates to product-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 인증된 사용자만 파일 삭제 가능 (Admin 삭제)
CREATE POLICY "Allow authenticated deletes from product-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_product_gallery_active_sort 
ON product_gallery (is_active, sort_order) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_product_gallery_created_at 
ON product_gallery (created_at DESC);

-- 7. 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_gallery_updated_at 
BEFORE UPDATE ON product_gallery 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 8. 설정 완료 확인
SELECT 
  'Storage bucket created' as status,
  id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'product-images';

SELECT 
  'RLS policies created' as status,
  schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('product_gallery', 'objects') 
AND schemaname IN ('public', 'storage');
