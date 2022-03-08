/**
 * Given a date object, calculate the time in a nicely-formatted string.
 * @param date
 */
function calculateTime(date: Date) {
  // Use 24-hour time based on setting

  // Calculate the time
  const hours = date.getHours().toString();
  const minutes = date.getMinutes();

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export default calculateTime;
