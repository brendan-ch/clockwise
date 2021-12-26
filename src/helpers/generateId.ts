import { TASKS } from '../StorageKeys';
import { Task } from '../types';
import { getData } from './storage';

/* eslint-disable no-await-in-loop */

/**
 * Generate a unique, numerical task ID.
 */
async function generateTaskId() {
  let unique = false;

  let id = Math.floor(Math.random() * 1000000);
  while (!unique) {
    try {
      const raw = await getData(TASKS);
      if (!raw) return id;
      const parsed = JSON.parse(raw);

      /* eslint-disable-next-line */
      const index = parsed.findIndex((existing: Task) => existing.id === id);
      if (index === -1) {
        unique = true;
      } else {
        id = Math.floor(Math.random() * 1000000);
      }
    } catch (e) {
      return id;
    }
  }

  return id;
}

export default generateTaskId;
