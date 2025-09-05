# Vercel 배포 가이드

## 🚀 배포 단계

### 1. Vercel CLI 설치 및 로그인
```bash
npm i -g vercel
vercel login
```

### 2. 프로젝트 배포
```bash
vercel
```

### 3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

#### 필수 환경 변수:
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- `VITE_ADMIN_EMAIL`: Admin 계정 이메일

#### 설정 방법:
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 위의 변수들을 추가

### 4. 도메인 설정 (선택사항)
- Vercel 대시보드에서 커스텀 도메인 설정 가능

## 📁 프로젝트 구조

```
/
├── client/          # React 프론트엔드
├── server/          # Express 백엔드 (서버리스 함수)
├── vercel.json      # Vercel 설정
└── env.example      # 환경 변수 예시
```

## ⚠️ 주의사항

1. **Supabase RLS 정책**: Storage 및 Database 접근 권한이 올바르게 설정되어야 함
2. **CORS 설정**: Supabase에서 Vercel 도메인을 허용 목록에 추가
3. **환경 변수**: 모든 필수 환경 변수가 Vercel에 설정되어야 함

## 🔧 문제 해결

### 배포 실패 시:
1. Vercel 로그 확인
2. 환경 변수 설정 확인
3. Supabase 연결 상태 확인

### API 라우트 문제:
- `/api/*` 경로는 자동으로 서버리스 함수로 처리됨
- `vercel.json`의 라우팅 설정 확인
