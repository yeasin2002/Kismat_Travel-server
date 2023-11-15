export function getStartDateAndEndDate(day = 7) {
  const start = new Date();

  const end = new Date(start.getTime());
  end.setDate(end.getDate() - day);
  end.setHours(0, 0, 0, 0);

  return { start, end };
}
