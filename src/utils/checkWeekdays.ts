export function checkWeekdays(day) {
  const dayName = new Date(day).getDay();
  if (dayName >= 1 && dayName <= 5) {
    return true;
  }
  return false;
}
