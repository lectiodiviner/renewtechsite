-- Admin 이미지 업로드 권한 문제 해결 (안전한 버전)
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. product_gallery 테이블의 기존 RLS 정책 삭제
DO $$
BEGIN
  -- product_gallery 테이블이 존재하는지 확인
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_gallery') THEN
    -- 기존 정책들 삭제
    DROP POLICY IF EXISTS "Admin can manage gallery" ON product_gallery;
    DROP POLICY IF EXISTS "Anyone can view active gallery" ON product_gallery;
    DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON product_gallery;
    
    RAISE NOTICE 'product_gallery 테이블의 기존 RLS 정책을 삭제했습니다.';
  ELSE
    RAISE NOTICE 'product_gallery 테이블이 존재하지 않습니다.';
  END IF;
END $$;

-- 2. product_gallery 테이블 RLS 정책 재설정
-- 모든 사용자가 활성화된 갤러리 조회 가능
CREATE POLICY "Anyone can view active gallery" ON product_gallery
FOR SELECT
TO public
USING (is_active = true);

-- 인증된 사용자만 갤러리 관리 가능 (Supabase Auth 사용)
CREATE POLICY "Authenticated users can manage gallery" ON product_gallery
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Storage RLS 정책 재설정
-- 기존 Storage 정책들 삭제
DROP POLICY IF EXISTS "Allow public downloads from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from product-images" ON storage.objects;

-- 새로운 Storage 정책들 생성
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

-- 4. 설정 완료 확인
SELECT 
  'RLS policies updated' as status,
  schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
AND tablename IN ('product_gallery', 'objects')
ORDER BY tablename, policyname;
