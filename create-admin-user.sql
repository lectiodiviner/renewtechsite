-- 새 Supabase 프로젝트에서 Admin 계정 생성
-- 이 SQL을 새 프로젝트의 SQL Editor에서 실행하세요

-- 1. Admin 사용자 생성 (이메일: yesminseo03@naver.com)
-- 비밀번호는 Supabase Dashboard의 Authentication > Users에서 설정하거나
-- 아래 함수를 사용하여 생성할 수 있습니다.

-- Admin 사용자 생성 함수
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- Admin 사용자가 이미 존재하는지 확인
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'yesminseo03@naver.com'
  ) THEN
    -- Admin 사용자 생성
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'yesminseo03@naver.com',
      crypt('test1234', gen_salt('bf')), -- 비밀번호: test1234
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    
    RAISE NOTICE 'Admin 사용자가 생성되었습니다. 이메일: yesminseo03@naver.com, 비밀번호: test1234';
  ELSE
    RAISE NOTICE 'Admin 사용자가 이미 존재합니다.';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 함수 실행
SELECT create_admin_user();

-- 2. Admin 사용자 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  role
FROM auth.users 
WHERE email = 'yesminseo03@naver.com';

-- 3. 함수 정리
DROP FUNCTION create_admin_user();
