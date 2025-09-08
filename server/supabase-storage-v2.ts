import { createClient } from '@supabase/supabase-js';
import { type User, type InsertUser, type QnaSubmission, type InsertQnaSubmission } from "../shared/schema.js";
import { type IStorage } from "./storage.js";

// Supabase 클라이언트 생성
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase 설정이 완료되지 않았습니다.');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export class SupabaseStorageV2 implements IStorage {
  private isConnected(): boolean {
    return supabase !== null;
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.isConnected()) {
      console.warn('Supabase가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return undefined;
      }
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.isConnected()) {
      console.warn('Supabase가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Error fetching user by username:', error);
        return undefined;
      }
      return data;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!this.isConnected()) {
      throw new Error('Supabase가 연결되지 않았습니다.');
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(insertUser)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createQnaSubmission(insertQnaSubmission: InsertQnaSubmission): Promise<QnaSubmission> {
    if (!this.isConnected()) {
      console.error('Supabase 연결 실패 - URL:', process.env.VITE_SUPABASE_URL, 'Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '설정됨' : '설정되지 않음');
      throw new Error('Supabase가 연결되지 않았습니다.');
    }
    try {
      console.log('Supabase에 QnA 제출 시도:', insertQnaSubmission);
      const { data, error } = await supabase
        .from('qna_submissions')
        .insert(insertQnaSubmission)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase QnA 제출 에러:', error);
        throw error;
      }
      console.log('Supabase QnA 제출 성공:', data);
      return data;
    } catch (error) {
      console.error('Supabase QnA 제출 중 예외:', error);
      throw error;
    }
  }

  async getQnaSubmissions(): Promise<QnaSubmission[]> {
    if (!this.isConnected()) {
      console.warn('Supabase가 연결되지 않았습니다.');
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('qna_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching QnA submissions:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching QnA submissions:', error);
      return [];
    }
  }

  async getQnaSubmission(id: string): Promise<QnaSubmission | undefined> {
    if (!this.isConnected()) {
      console.warn('Supabase가 연결되지 않았습니다.');
      return undefined;
    }
    try {
      const { data, error } = await supabase
        .from('qna_submissions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching QnA submission:', error);
        return undefined;
      }
      return data;
    } catch (error) {
      console.error('Error fetching QnA submission:', error);
      return undefined;
    }
  }

  async answerQnaSubmission(id: string, answer: string): Promise<QnaSubmission | undefined> {
    if (!this.isConnected()) {
      throw new Error('Supabase가 연결되지 않았습니다.');
    }
    try {
      const { data, error } = await supabase
        .from('qna_submissions')
        .update({
          answer,
          is_answered: true,
          answered_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating QnA submission:', error);
        return undefined;
      }
      return data;
    } catch (error) {
      console.error('Error updating QnA submission:', error);
      return undefined;
    }
  }
}

