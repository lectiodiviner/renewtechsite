import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'YOUR_NEW_DATABASE_URL') {
  console.warn("⚠️ DATABASE_URL이 설정되지 않았습니다. 메모리 스토리지를 사용합니다.");
  // 메모리 스토리지 사용을 위해 에러를 던지지 않음
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
