import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 사용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase 설정
const supabaseUrl = 'https://gzxqxurhutoumqoaxnow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eHF4dXJodXRvdW1xb2F4bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTU2MTAsImV4cCI6MjA3MjQ3MTYxMH0.9YUhly_uHsH0VphzK0oW62ulE0ZIEYdPXMvIYNVfnlM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 마이그레이션할 이미지 데이터
const imagesToMigrate = [
  {
    title: 'Recycled Kraft Paper Shopping Bag - Nature',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Recycled Kraft Paper Shopping Bag',
    fileName: 'KakaoTalk_20250821_115422394_01_1755766655585.jpg',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250821_115422394_01_1755766655585.jpg')
  },
  {
    title: 'Recycled Kraft Paper Shopping Bag - Lakeside',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Recycled Kraft Paper Shopping Bag',
    fileName: 'KakaoTalk_20250821_115422394_07_1755766655585.jpg',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250821_115422394_07_1755766655585.jpg')
  },
  {
    title: 'Recycled Kraft Paper Shopping Bag - Urban',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Recycled Kraft Paper Shopping Bag',
    fileName: 'KakaoTalk_20250821_115422394_12_1755766655586.jpg',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250821_115422394_12_1755766655586.jpg')
  },
  {
    title: 'Biodegradable Shopping Bag - Style 1',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Biodegradable shopping bag',
    fileName: 'KakaoTalk_20250825_121348376_1756109054508.png',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250825_121348376_1756109054508.png')
  },
  {
    title: 'Biodegradable Shopping Bag - Style 2',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Biodegradable shopping bag',
    fileName: 'KakaoTalk_20250825_121524132_1756109054509.png',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250825_121524132_1756109054509.png')
  },
  {
    title: 'Biodegradable Shopping Bag - Style 3',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Biodegradable shopping bag',
    fileName: 'KakaoTalk_20250825_121631471_1756109054509.png',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250825_121631471_1756109054509.png')
  },
  {
    title: 'Waterproof Paper Product',
    description: 'Comfort for you. Relief for the Earth.',
    category: 'Waterproof Paper',
    fileName: 'KakaoTalk_20250825_205747637_1756123331624.png',
    filePath: path.join(__dirname, 'attached_assets', 'KakaoTalk_20250825_205747637_1756123331624.png')
  }
];

async function migrateImages() {
  console.log('🚀 이미지 마이그레이션 시작...');
  
  for (let i = 0; i < imagesToMigrate.length; i++) {
    const image = imagesToMigrate[i];
    
    try {
      console.log(`\n📸 ${i + 1}/${imagesToMigrate.length} - ${image.title} 마이그레이션 중...`);
      
      // 파일 존재 확인
      if (!fs.existsSync(image.filePath)) {
        console.log(`❌ 파일을 찾을 수 없습니다: ${image.filePath}`);
        continue;
      }
      
      // 파일 읽기
      const fileBuffer = fs.readFileSync(image.filePath);
      const fileExt = path.extname(image.fileName).substring(1);
      const mimeType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;
      
      // Supabase Storage에 업로드
      const storageFileName = `migrated-${Date.now()}-${i}-${image.fileName}`;
      const storagePath = `product-images/${storageFileName}`;
      
      console.log(`📤 Supabase Storage에 업로드 중: ${storagePath}`);
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType
        });
      
      if (uploadError) {
        console.log(`❌ Storage 업로드 실패:`, uploadError);
        continue;
      }
      
      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(storagePath);
      
      // 데이터베이스에 레코드 추가
      console.log(`💾 데이터베이스에 레코드 추가 중...`);
      
      const { error: insertError } = await supabase
        .from('product_gallery')
        .insert({
          title: image.title,
          description: image.description,
          image_url: publicUrl,
          image_path: storagePath,
          file_size: fileBuffer.length,
          mime_type: mimeType,
          is_active: true,
          sort_order: i
        });
      
      if (insertError) {
        console.log(`❌ 데이터베이스 삽입 실패:`, insertError);
        continue;
      }
      
      console.log(`✅ ${image.title} 마이그레이션 완료!`);
      console.log(`   📍 URL: ${publicUrl}`);
      console.log(`   📁 Storage Path: ${storagePath}`);
      
    } catch (error) {
      console.log(`❌ ${image.title} 마이그레이션 실패:`, error);
    }
  }
  
  console.log('\n🎉 마이그레이션 완료!');
  console.log('📊 마이그레이션된 이미지 수:', imagesToMigrate.length);
}

// 마이그레이션 실행
migrateImages().catch(console.error);
