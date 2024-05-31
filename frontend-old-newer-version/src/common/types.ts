export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum Classification {
  UNKNOWN = "Unknown",
  MALICIOUS = "Phishing",
  UN_PROCESSED = "Unprocessed",
  BENIGN = "Benign",
}

export interface Case {
  uuid: string;
  name: string;
  rel_size: number;
}

export enum ScrapeStatus {
  PENDING = "pending",
  SCRAPING = "scraping",
  FAILED = "failed",
  READY = "ready",
}

export interface SocialMediaItemComment {
  uuid: string;
  added_at: number;
  text: string;
}

export interface SocialMediaItem {
  uuid: string;
  user: null | string;
  status: ScrapeStatus;
  kind: SocialMediaKind;
  added_at: number;
  cases: Case[];
  analyst: AnalystInfo;
}

export interface SavedImage {
  key: string;
  url: string;
  image_hash: string;
}

export interface SocialMediaScrapeResult {
  images: SavedImage[];
  raw: unknown;
}

export interface SocialMediaScraperData {
  result: SocialMediaScrapeResult;
}

export enum SocialMediaKind {
  TWITTER_POST = "twitter_post",
  INSTAGRAM_POST = "instagram_post",
  TIKTOK_VIDEO = "tiktok_video",
}

export type WindowSize = "day" | "week" | "month" | "year" | "all";

export enum Platform {
  TWITTER = "twitter",
  REDDIT = "reddit",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
  FACEBOOK = "facebook",
}

export interface AnalystInfo {
  username: string;
  full_name: string;
}
