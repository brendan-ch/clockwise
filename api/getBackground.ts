import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI;

// @ts-ignore
let cached = null;
interface IBackground {
  uri: string,
}

// @ts-ignore
const Background = mongoose.model<IBackground>('background', { uri: String });

async function connectToDB(uri: string) {
  // @ts-ignore
  if (cached !== null) return;
  cached = await mongoose.connect(uri);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!mongoUri) {
    return res.status(500).json({
      error: 'Unable to connect to database',
    });
  }

  await connectToDB(mongoUri);

  const count = await Background.countDocuments();
  const rand = Math.floor(Math.random() * count);

  const background = await Background.findOne().skip(rand);

  if (!background) {
    return res.status(404).json({
      error: 'No background found',
      rand,
      count,
    });
  }

  return res.status(200).json({
    uri: background.uri,
    rand,
    count,
  });
}
