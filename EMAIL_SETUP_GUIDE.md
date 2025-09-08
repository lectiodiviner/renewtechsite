# 이메일 발송 설정 가이드

Q&A 답변 시 문의자에게 자동으로 이메일이 발송되도록 설정하는 방법을 안내합니다.

## 1. Gmail 설정 (권장)

### 1.1 Gmail 앱 비밀번호 생성

1. Google 계정 설정으로 이동: https://myaccount.google.com/
2. **보안** 탭 클릭
3. **2단계 인증** 활성화 (아직 활성화하지 않은 경우)
4. **앱 비밀번호** 섹션에서 **앱 비밀번호 생성** 클릭
5. 앱 이름을 "RenewTech Site"로 입력
6. 생성된 16자리 비밀번호를 복사하여 저장

### 1.2 환경변수 설정

`.env` 파일에 다음 정보를 추가하세요:

```env
# Gmail SMTP 설정
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=lectiodiviner@gmail.com
EMAIL_PASS=emzf hgfm kfim rtwi
```

## 2. 다른 이메일 서비스 설정

### 2.1 Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### 2.2 Yahoo Mail

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### 2.3 Naver Mail

```env
EMAIL_HOST=smtp.naver.com
EMAIL_PORT=587
EMAIL_USER=your-email@naver.com
EMAIL_PASS=your-password
```

## 3. 설정 확인

서버를 재시작한 후, 관리자 페이지에서 Q&A 답변을 작성하면 자동으로 이메일이 발송됩니다.

### 3.1 이메일 발송 확인

- 서버 콘솔에서 "답변 이메일이 [이메일]로 발송되었습니다" 메시지 확인
- 문의자의 이메일함에서 답변 이메일 수신 확인

### 3.2 문제 해결

**이메일이 발송되지 않는 경우:**

1. 환경변수가 올바르게 설정되었는지 확인
2. Gmail의 경우 앱 비밀번호를 사용하고 있는지 확인
3. 2단계 인증이 활성화되어 있는지 확인
4. 방화벽이나 네트워크 설정으로 인한 차단 여부 확인

**서버 콘솔 메시지:**
- "이메일 서비스가 설정되지 않아 이메일을 발송할 수 없습니다" → 환경변수 설정 필요
- "이메일 발송 실패" → 인증 정보 또는 네트워크 문제

## 4. 이메일 템플릿

발송되는 이메일의 형식:

**제목:** `reply to [이름]'s question`

**내용:**
- HTML 형식으로 깔끔하게 포맷팅
- 답변 내용
- RENEWTECH 연락처 정보 포함

## 5. 보안 고려사항

- 앱 비밀번호는 일반 비밀번호와 다르게 생성된 전용 비밀번호를 사용
- 환경변수 파일(.env)은 버전 관리에 포함하지 않도록 주의
- 프로덕션 환경에서는 더 강력한 이메일 서비스(AWS SES, SendGrid 등) 사용 권장

## 6. 테스트

설정 완료 후 다음 단계로 테스트하세요:

1. 홈페이지에서 테스트 문의 제출
2. 관리자 페이지에서 답변 작성
3. 문의자 이메일로 답변이 발송되는지 확인
