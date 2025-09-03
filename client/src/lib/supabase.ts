import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gzxqxurhutoumqoaxnow.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eHF4dXJodXRvdW1xb2F4bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTU2MTAsImV4cCI6MjA3MjQ3MTYxMH0.9YUhly_uHsH0VphzK0oW62ulE0ZIEYdPXMvIYNVfnlM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin 이메일 주소
export const ADMIN_EMAIL = 'lectiodiviner@gmail.com'
