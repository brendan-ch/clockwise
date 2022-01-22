import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;
  return res.status(200).json({
    text: `Hello ${name}!`,
  });
}
