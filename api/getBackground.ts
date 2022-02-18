// @ts-nocheck
/* eslint-disable no-await-in-loop */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI;

let cached = null;
interface IBackground {
  uri: string,
  author: string,
  link: string,
}

const Background = mongoose.model<IBackground>('background', {
  uri: String,
  author: String,
  link: String,
});

async function connectToDB(uri: string) {
  // @ts-ignore
  if (cached !== null) return;
  cached = await mongoose.connect(uri);
}

/**
 * Returns a boolean indicating whether the background object is valid.
 * @param obj
 */
function validateBackground(obj: IBackground): boolean {
  return obj.author
    && obj.link
    && obj.uri
    && typeof obj.author === 'string'
    && typeof obj.link === 'string'
    && typeof obj.uri === 'string';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!mongoUri) {
    return res.status(500).json({
      error: 'Unable to connect to database',
    });
  }

  await connectToDB(mongoUri);

  const count = await Background.countDocuments();
  let rand = Math.floor(Math.random() * count);

  let background = await Background.findOne().skip(rand);

  // To prevent potential infinite loop
  // if there are no valid backgrounds
  let i = 0;
  const max = 5;

  // Validate the data
  while (!validateBackground(background) && i < max) {
    rand = Math.floor(Math.random() * count);
    background = await Background.findOne().skip(rand);

    i += 1;
  }

  if (!background || i >= max) {
    return res.status(404).json({
      error: 'No background found',
      rand,
      count,
    });
  }

  return res.status(200).json({
    uri: background.uri,
    author: background.author,
    link: background.link,
    rand,
    count,
  });
}
