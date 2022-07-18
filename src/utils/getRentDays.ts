export function getRentDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = end.getDay() - start.getDay();
  return days;
}
