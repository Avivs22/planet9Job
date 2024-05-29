import { ScrapeStatus, WindowSize } from "./types.ts";

export function convertStrToMilliseconds (input: string): number  {
  const units: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = input.match(/^(\d+)([smhd])$/);
  if (!match) {
      throw new Error("Input format is invalid. Please use the format like '10s', '5m', '2h', or '1d'.");
  }
  const [, value, unit] = match;
  if (!units.hasOwnProperty(unit)) {
      throw new Error(`Unsupported time unit '${unit}'. Only 's' (seconds), 'm' (minutes), 'h' (hours), and 'd' (days) are supported.`);
  }
  return parseInt(value, 10) * units[unit];
};

export function getTimeRange(windowSize: WindowSize, end?: Date) {
  if (windowSize == "all") return [null, null];

  end = end ?? new Date();
  const start = new Date(end);
  switch (windowSize) {
    case "day":
      start.setDate(start.getDate() - 1);
      break;

    case "week":
      start.setDate(start.getDate() - 7);
      break;

    case "month":
      start.setDate(start.getDate() - 30);
      break;

    case "year":
      start.setDate(start.getDate() - 365);
      break;
  }

  return [start, end];
}

export function getTimeRangeInSeconds(windowSize: WindowSize, end?: Date) {
  const [start, newEnd] = getTimeRange(windowSize, end);
  return [
    start ? Math.floor(start.getTime() / 1000) : null,
    newEnd ? Math.ceil(newEnd.getTime() / 1000) : null,
  ];
}

export function getDoubleTimeRangeInSeconds(windowSize: WindowSize) {
  if (windowSize === "all") return [null, null, null];

  const [start, end] = getTimeRange(windowSize);
  const preStart = getTimeRange(windowSize, start!)[0];

  return [
    preStart ? Math.floor(preStart.getTime() / 1000) : null,
    start ? Math.floor(start.getTime() / 1000) : null,
    end ? Math.ceil(end.getTime() / 1000) : null,
  ];
}

export function getMediaUrl(url: string) {
  return `/api/image?url=${encodeURIComponent(url)}`;
}

export function isScamsUser() {
  const savedToken = localStorage.getItem("token")?.replace(/"/g, "");
  return Boolean(savedToken?.startsWith?.("eeb0"));
}

export function isWaitingStatus(status: ScrapeStatus) {
  return status == ScrapeStatus.PENDING || status === ScrapeStatus.SCRAPING;
}
