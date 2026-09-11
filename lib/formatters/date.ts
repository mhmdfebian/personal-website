const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(date: string | Date) {
  const value = typeof date === "string" ? new Date(`${date}T00:00:00Z`) : date;
  return monthYearFormatter.format(value);
}

export function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean) {
  return `${formatMonthYear(startDate)} - ${isCurrent || !endDate ? "Present" : formatMonthYear(endDate)}`;
}