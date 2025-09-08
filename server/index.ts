import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

// 기본 미들웨어 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CORS 설정 (Vercel에서 필요할 수 있음)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 로깅 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// 전역 에러 핸들러
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Vercel 서버리스 함수를 위한 설정
let server: any;
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;
  
  try {
    console.log('앱 초기화 시작...');
    server = await registerRoutes(app);
    console.log('라우트 등록 완료');

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
      console.log('Vite 설정 완료');
    } else {
      serveStatic(app);
      console.log('정적 파일 서빙 설정 완료');
    }

    // Vercel에서는 서버를 직접 시작하지 않음
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
      // ALWAYS serve the app on the port specified in the environment variable PORT
      // Other ports are firewalled. Default to 5000 if not specified.
      // this serves both the API and the client.
      // It is the only port that is not firewalled.
      const port = parseInt(process.env.PORT || '5000', 10);
      server.listen({
        port,
        host: "0.0.0.0",
      }, () => {
        log(`serving on port ${port}`);
      });
    }
    
    isInitialized = true;
    console.log('앱 초기화 완료');
  } catch (error) {
    console.error('앱 초기화 실패:', error);
    throw error;
  }
}

// Vercel 서버리스 함수에서는 초기화를 지연시킴
if (process.env.VERCEL === "1") {
  // Vercel에서는 요청이 올 때마다 초기화 확인
  app.use(async (req, res, next) => {
    try {
      await initializeApp();
      next();
    } catch (error) {
      console.error('초기화 중 에러:', error);
      res.status(500).json({ error: '서버 초기화 실패' });
    }
  });
} else {
  // 로컬 개발에서는 즉시 초기화
  initializeApp().catch(console.error);
}

// Vercel을 위한 export
export default app;
