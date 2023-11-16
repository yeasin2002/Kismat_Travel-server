export function getDatesBetween(prev: Date, current: Date) {
  const dates = [];
  const currentDate = new Date(prev);

  while (currentDate <= new Date(current)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
