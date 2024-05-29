import { useQuery } from "react-query";
import axios from "axios";
import {
  Case,
  Platform,
  ScrapeStatus,
  SocialMediaItem,
  SocialMediaItemComment,
  SocialMediaScraperData,
  WindowSize,
} from "./types.ts";

export interface ListCasesParams {}

export interface ListCasesResponse {
  items: Case[];
}

export function useListCasesQuery(params: ListCasesParams) {
  return useQuery(
    ["list-cases", params],
    async () => {
      return (await axios.get("/api/cases/list", { params }))
        .data as ListCasesResponse;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
}

export interface ListSDBItemsParams {
  page: number;
  page_size: number;
  case_uuid?: string;
}

export interface ListSDBItemsResponse {
  items: SocialMediaItem[];
  total: number;
}

export function useListSDBItemsQuery(
  params: ListSDBItemsParams,
  options?: { refetchWhilePending?: boolean },
) {
  const { refetchWhilePending = false } = options ?? {};

  return useQuery(
    ["list-sdb-items", params],
    async () => {
      return (await axios.get("/api/sdb/list", { params }))
        .data as ListSDBItemsResponse;
    },
    {
      // refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: !refetchWhilePending
        ? false
        : (data) => {
            if (!data?.items) return false;

            return data.items.some(
              (item) =>
                item.status === ScrapeStatus.PENDING ||
                item.status === ScrapeStatus.SCRAPING,
            )
              ? 1000
              : false;
          },
    },
  );
}

export interface GetSDBItemParams {
  uuid?: string;
}

export interface GetSDBItemResponse {
  item: null | SocialMediaItem;
  scraper: null | SocialMediaScraperData;
  comments: SocialMediaItemComment[];
}

export function useGetSDBItemQuery(params: GetSDBItemParams) {
  return useQuery(
    ["sdb-item", params],
    async () => {
      return (await axios.get("/api/sdb/get", { params }))
        .data as GetSDBItemResponse;
    },
    {
      retry: false,
      enabled: !!params.uuid,
    },
  );
}

export interface GetSDBStatsParams {
  window_size: WindowSize;
  window_pre_start?: null | number;
  window_start?: null | number;
  window_end?: null | number;
  case_uuid?: null | string;
}

export interface GetSDBStatsResponse {
  num_posts: number;
  num_posts_change: number;
  num_users: number;
  num_cases: number;
  num_total_cases: number;
  top_cases: [string, number][];
  line_chart: null | [string, number][];
  most_per_tick: null | number;
}

export function useGetSDBStatsQuery(params: GetSDBStatsParams) {
  return useQuery(
    ["sdb-stats", params],
    async () => {
      return (await axios.get("/api/sdb/stats", { params }))
        .data as GetSDBStatsResponse;
    },
    {
      retry: false,
    },
  );
}

export interface GetPlatformStatsParams {}

export interface GetPlatformStatsResponse {
  platforms: {
    [key: string]: number;
  };
}

export function useGetPlatformStatsQuery(params: GetPlatformStatsParams) {
  return useQuery(
    ["sdb-platform-stats", params],
    async () => {
      return (await axios.get("/api/sdb/platform-stats", { params }))
        .data as GetPlatformStatsResponse;
    },
    {
      retry: false,
    },
  );
}

export interface GetWordcloudParams {
  case_uuid?: null | string;
  window_start?: null | number;
  window_end?: null | number;
}

export interface GetWordcloudResponse {
  words: {
    [key: string]: number;
  };
}

export function useGetWordcloudQuery(params: GetWordcloudParams) {
  return useQuery(
    ["wordcloud", params],
    async () => {
      return (await axios.get("/api/sdb/wordcloud", { params }))
        .data as GetWordcloudResponse;
    },
    {
      retry: false,
    },
  );
}
