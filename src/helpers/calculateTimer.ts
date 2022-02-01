/**
 * Returns a timer string calculade from the milliseconds remaining.
 * @param ms The number of milliseconds remaining.
 */
function calculateTimerDisplay(ms: number) {
  if (ms < 0) return '0:00';

  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor((ms - minutes * 60 * 1000) / 1000);

  let secondsString = seconds.toString();
  if (secondsString.length === 1) {
    secondsString = `0${secondsString}`;
  }

  return `${minutes}:${secondsString}`;
}

export default calculateTimerDisplay;
