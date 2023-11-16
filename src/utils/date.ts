export function createCurrentYearMonthDate(monthNumber) {
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthNumber - 1); // Month is zero-based in JavaScript
}

export function getDatesBetween(prev: Date, current: Date) {
  const dates = [];
  const currentDate = new Date(prev);

  while (currentDate <= new Date(current)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getStartDateAndEndDate(day = 6) {
  const currentDay = new Date();

  const sevenDaysEgo = new Date();
  sevenDaysEgo.setDate(sevenDaysEgo.getDate() - day);

  return { currentDay, sevenDaysEgo };
}
