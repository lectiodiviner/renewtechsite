import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cktutvtbfrdnxkopeodj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdHV0dnRiZnJkbnhrb3Blb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjgxMjYsImV4cCI6MjA3MjY0NDEyNn0.Zke_VOl_lKHsW1ruYE_ApQcZ6sZwBKiYClIvb0FJFGU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin 이메일 주소
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'yesminseo03@naver.com'
