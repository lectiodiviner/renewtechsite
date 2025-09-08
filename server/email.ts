import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // 환경변수에서 이메일 설정 가져오기
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailHost || !emailPort || !emailUser || !emailPass) {
      console.warn('이메일 설정이 완료되지 않았습니다. 환경변수를 확인해주세요.');
      return;
    }

    this.config = {
      host: emailHost,
      port: parseInt(emailPort),
      secure: parseInt(emailPort) === 465, // 465는 SSL, 587은 TLS
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.transporter) {
      console.error('이메일 서비스가 초기화되지 않았습니다.');
      return false;
    }

    try {
      const mailOptions = {
        from: this.config?.auth.user,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html || emailData.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('이메일 발송 성공:', result.messageId);
      return true;
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      return false;
    }
  }

  async sendQnAReply(name: string, email: string, answer: string): Promise<boolean> {
    const subject = `reply to ${name}'s question`;
    const text = answer;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 10px;">
          문의 답변
        </h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${answer}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
          <p>이 답변이 도움이 되었기를 바랍니다.</p>
          <p>추가 문의사항이 있으시면 언제든지 연락해주세요.</p>
          <br>
          <p><strong>RENEWTECH</strong></p>
          <p>Email: anytime@naver.com</p>
          <p>Phone: +82-10-8767-3888</p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }
}

export const emailService = new EmailService();
