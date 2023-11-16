export function getStartDateAndEndDate(day = 6) {
  const currentDay = new Date();

  const sevenDaysEgo = new Date();
  sevenDaysEgo.setDate(sevenDaysEgo.getDate() - day);

  return { currentDay, sevenDaysEgo };
}
