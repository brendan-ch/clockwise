/**
 * Given a date object, calculate the time in a nicely-formatted string.
 * @param date
 * @param type
 */
function calculateTime(date: Date, type: '12h' | '24h' = '24h') {
  // Calculate the time
  let hours = date.getHours();
  const minutes = date.getMinutes();

  let after = '';
  if (type === '12h' && hours > 11) {
    after = ' PM';
  } else if (type === '12h') {
    after = ' AM';
  }

  if (type === '12h' && hours > 12) {
    hours -= 12;
  } else if (type === '12h' && hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}${after}`;
}

export default calculateTime;
