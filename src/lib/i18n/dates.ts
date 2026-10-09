export type DateLanguage = "ne-NP" | "en";

const devanagariDigits = "०१२३४५६७८९";
const nepaliMonths: Record<string, string> = {
  January: "जनवरी",
  February: "फेब्रुअरी",
  March: "मार्च",
  April: "अप्रिल",
  May: "मे",
  June: "जुन",
  July: "जुलाई",
  August: "अगस्ट",
  September: "सेप्टेम्बर",
  October: "अक्टोबर",
  November: "नोभेम्बर",
  December: "डिसेम्बर",
};
const nepaliWeekdays: Record<string, string> = {
  Sunday: "आइतबार",
  Monday: "सोमबार",
  Tuesday: "मङ्गलबार",
  Wednesday: "बुधबार",
  Thursday: "बिहीबार",
  Friday: "शुक्रबार",
  Saturday: "शनिबार",
};

function toDevanagari(value: string) {
  return value.replace(/[0-9]/gu, (digit) => devanagariDigits[Number(digit)]);
}

function formatNepaliFallback(
  date: Date,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"],
  timeStyle: Intl.DateTimeFormatOptions["timeStyle"],
  timeZone: string,
) {
  const sourceOptions: Intl.DateTimeFormatOptions =
    dateStyle === "short"
      ? { year: "2-digit", month: "numeric", day: "numeric", timeZone }
      : {
          ...(dateStyle === "full" ? { weekday: "long" as const } : {}),
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone,
        };
  const parts = new Intl.DateTimeFormat("en-US", sourceOptions).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  const dateText =
    dateStyle === "short"
      ? `${toDevanagari(part("year"))}/${toDevanagari(part("month"))}/${toDevanagari(part("day"))}`
      : `${toDevanagari(part("year"))} ${nepaliMonths[part("month")]} ${toDevanagari(part("day"))}${part("weekday") ? `, ${nepaliWeekdays[part("weekday")]}` : ""}`;

  if (!timeStyle) return dateText;

  const timeParts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).formatToParts(date);
  const timePart = (type: Intl.DateTimeFormatPartTypes) =>
    timeParts.find((item) => item.type === type)?.value ?? "";
  const period = timePart("dayPeriod") === "AM" ? "पूर्वाह्न" : "अपराह्न";
  return `${dateText}, ${toDevanagari(timePart("hour"))}:${toDevanagari(timePart("minute"))} ${period}`;
}

export function formatLocalizedDate(
  date: Date,
  language: DateLanguage,
  options: Pick<Intl.DateTimeFormatOptions, "dateStyle" | "timeStyle" | "timeZone"> = {},
) {
  const { dateStyle = "medium", timeStyle, timeZone = "Asia/Kathmandu" } = options;
  const formatOptions: Intl.DateTimeFormatOptions = { dateStyle, timeStyle, timeZone };
  if (language === "en") return new Intl.DateTimeFormat("en", formatOptions).format(date);
  return formatNepaliFallback(date, dateStyle, timeStyle, timeZone);
}
