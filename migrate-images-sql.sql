-- 기존 이미지들을 Supabase product_gallery 테이블에 마이그레이션하는 SQL 스크립트
-- 이 스크립트는 Supabase SQL Editor에서 실행해야 합니다.

-- 기존 데이터 정리 (선택사항)
-- DELETE FROM product_gallery WHERE title LIKE '%migrated%';

-- Recycled Kraft Paper Shopping Bag 이미지들
INSERT INTO product_gallery (
  title, 
  description, 
  image_url, 
  image_path, 
  file_size, 
  mime_type, 
  is_active, 
  sort_order
) VALUES 
(
  'Recycled Kraft Paper Shopping Bag - Nature',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-kraft-nature.jpg',
  'product-images/migrated-kraft-nature.jpg',
  9742099,
  'image/jpeg',
  true,
  0
),
(
  'Recycled Kraft Paper Shopping Bag - Lakeside',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-kraft-lakeside.jpg',
  'product-images/migrated-kraft-lakeside.jpg',
  9836575,
  'image/jpeg',
  true,
  1
),
(
  'Recycled Kraft Paper Shopping Bag - Urban',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-kraft-urban.jpg',
  'product-images/migrated-kraft-urban.jpg',
  9881920,
  'image/jpeg',
  true,
  2
),
(
  'Biodegradable Shopping Bag - Style 1',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-biodegradable-1.png',
  'product-images/migrated-biodegradable-1.png',
  636683,
  'image/png',
  true,
  3
),
(
  'Biodegradable Shopping Bag - Style 2',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-biodegradable-2.png',
  'product-images/migrated-biodegradable-2.png',
  444673,
  'image/png',
  true,
  4
),
(
  'Biodegradable Shopping Bag - Style 3',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-biodegradable-3.png',
  'product-images/migrated-biodegradable-3.png',
  1063567,
  'image/png',
  true,
  5
),
(
  'Waterproof Paper Product',
  'Comfort for you. Relief for the Earth.',
  'https://gzxqxurhutoumqoaxnow.supabase.co/storage/v1/object/public/product-images/migrated-waterproof.png',
  'product-images/migrated-waterproof.png',
  156200,
  'image/png',
  true,
  6
);

-- 마이그레이션 완료 확인
SELECT 
  id,
  title,
  description,
  image_url,
  file_size,
  mime_type,
  is_active,
  sort_order,
  created_at
FROM product_gallery 
WHERE title LIKE '%migrated%'
ORDER BY sort_order;
