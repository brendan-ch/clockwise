import { Audio } from 'expo-av';

/* eslint-disable global-require */

async function playTimerSound() {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/timer.mp3'),
  );

  await sound.playAsync();
  // await sound.unloadAsync();
}

/* eslint-disable-next-line */
export { playTimerSound };
