import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Test API 호출됨:', req.method);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Test API is working!', method: req.method });
  }
  
  if (req.method === 'POST') {
    return res.status(200).json({ message: 'POST request received!', body: req.body });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
