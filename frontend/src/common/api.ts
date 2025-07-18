import { useQuery, UseQueryResult } from "react-query";
import axiosInstance from './axiosInterface.ts';
import {
  Case,
  Platform,
  ScrapeStatus,
  SocialMediaItem,
  SocialMediaItemComment,
  SocialMediaScraperData,
  WindowSize
} from "./types.ts";

export interface ListCasesParams {
}

export interface ListCasesResponse {
  items: Case[];
}

export function useListCasesQuery(params: ListCasesParams) {
  return useQuery(['list-cases', params], async () => {
    return (await axiosInstance.get('/api/cases/list', { params })).data as ListCasesResponse;
  }, {
    refetchOnWindowFocus: false,
    retry: false,
  });
}


export interface ExecutionsParams {
  refreshInterval: number
}

export function useGetExecutionQuery<T>(params: ExecutionsParams) {
  return useQuery(['data', params], async () => {
    return (await axiosInstance.get('/api/get_recently_upload_batch', { params })).data as unknown as T;
  }, {
    refetchInterval: params.refreshInterval
  });
}


export interface ScanDetailsInfoParams {
  scan_uuid?: string;
  enviroment?: string;
}

export function useGetScanDetailsInfoQuery<T>(params: ScanDetailsInfoParams) {
  return useQuery(['scandata', params], async () => {
    return (await axiosInstance.get('/api/analysis/scan/get_submitted_info', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}



export interface RedirectInfoParams {
  scan_uuid?: string;
  enviroment?: string;
}

export function useGetRedirectInfoQuery<T>(params: RedirectInfoParams) {
  return useQuery(['redirectdata', params], async () => {
    return (await axiosInstance.get('/api/analysis/scan/get_redirection', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}

export interface GetTLS{
  enviroment?:string
  scan_uuid?:string
  redictrion_idx?:number
  depth?:number
}
export async function retriveModeTLSDataElement<T>(params: GetTLS): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/scan/get_tls", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
export interface GetAnalysis{
  enviroment?:string
  scan_uuid?:string
  redictrion_idx?:number
  depth?:number
}
export async function retriveModelWHOISElement<T>(params: GetAnalysis): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/scan/get_whois", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
export async function retriveModelExternalLinksElement<T>(params: GetAnalysis): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/scan/external_links", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
export async function retriveModelSunBurstChartElement<T>(params: GetAnalysis): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/explainability", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function retriveModelScreenShotElement<T>(params: GetAnalysis): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/scan/get_screenshot", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function retriveModelIpInfoElement<T>(params: GetAnalysis): Promise<T> {
  try {
    const response = await axiosInstance.get("/api/analysis/scan/ip_info", { params });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}





export interface BatchStatusInfoParams {
  batch_uuid: string;
}

export function useGetBatchStatusInfoQuery<T>(params: BatchStatusInfoParams) {
  return useQuery(['data', params], async () => {
    return (await axiosInstance.get('/api/get_batch_status/url_status', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}

export interface BatchInferenceInfoParams {
  batch_uuid: string;
  enviroment: string;
}

export function useGetBatchInferenceInfoQuery<T>(params: BatchInferenceInfoParams) {
  return useQuery(['data1', params], async () => {
    return (await axiosInstance.get('/api/get_batch_status/urls_inference', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}


export interface BatchOODInfoParams {
  batch_uuid: string;
}

export function useGetBatchOodInfoQuery<T>(params: BatchOODInfoParams) {
  return useQuery(['data2', params], async () => {
    return (await axiosInstance.get('/api/get_batch_status/urls_ood', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}


export interface BatchEnticementInfoParams {
  batch_uuid: string;
}

export function useGetBatchEnticementInfoQuery<T>(params: BatchEnticementInfoParams) {
  return useQuery(['data3', params], async () => {
    return (await axiosInstance.get('/api/get_batch_status/urls_enticement', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}


export interface ModelPredictionInfoParams {
  scan_uuid?: string;
  enviroment?:string;
}

export function useGetModelPredictionInfoQuery<T>(params: ModelPredictionInfoParams) {
  return useQuery(['data1', params], async () => {
    return (await axiosInstance.get('/api/analysis/scan/get_model_prediction_per_device', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}


export interface FilterURLInfoParams {
  filter_object: string;
}

export function useGetFilteredDataQuery<T>(params: FilterURLInfoParams) {
  return useQuery(['data1', params], async () => {
    return (await axiosInstance.get('/api/filtered_scanned_urls', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}



export interface ScannedURLsParams {
}
export function useGetScannedURLsQuery<T>(params: ScannedURLsParams) {
  return useQuery(['data', params], async () => {
    return (await axiosInstance.get('/api/all_scanned_urls', { params })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
}

export interface BatchInfoParams {
  batch_uuid: string;
}
export function useGetBatchInfoQuery<T>(params: BatchInfoParams) {
  // Ensure download_mode is set to false
  const requestParams = { ...params, download_mode: true };
  return useQuery(['data4', params], async () => {
    return (await axiosInstance.get('/api/get_batch_items', { params: requestParams })).data as unknown as T;
  }, {
    // refetchInterval: params.refreshInterval
  });
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

export function useListSDBItemsQuery(params: ListSDBItemsParams, options?: { refetchWhilePending?: boolean }) {
  const { refetchWhilePending = false } = options ?? {};

  return useQuery(['list-sdb-items', params], async () => {
    return (await axiosInstance.get('/api/sdb/list', { params })).data as ListSDBItemsResponse;
  }, {
    // refetchOnWindowFocus: false,
    retry: false,
    refetchInterval: !refetchWhilePending ? false : (data) => {
      if (!data?.items)
        return false;

      return data.items.some(item => item.status === ScrapeStatus.PENDING || item.status === ScrapeStatus.SCRAPING) ? 1000 : false;
    },
  });
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
  return useQuery(['sdb-item', params], async () => {
    return (await axiosInstance.get('/api/sdb/get', { params })).data as GetSDBItemResponse;
  }, {
    retry: false,
    enabled: !!params.uuid,
  });
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
  return useQuery(['sdb-stats', params], async () => {
    return (await axiosInstance.get('/api/sdb/stats', { params })).data as GetSDBStatsResponse;
  }, {
    retry: false,
  });
}


export interface GetPlatformStatsParams {
}

export interface GetPlatformStatsResponse {
  platforms: {
    [key: string]: number,
  },
}

export function useGetPlatformStatsQuery(params: GetPlatformStatsParams) {
  return useQuery(['sdb-platform-stats', params], async () => {
    return (await axiosInstance.get('/api/sdb/platform-stats', { params })).data as GetPlatformStatsResponse;
  }, {
    retry: false,
  });
}


export interface GetWordcloudParams {
  case_uuid?: null | string;
  window_start?: null | number;
  window_end?: null | number;
}

export interface GetWordcloudResponse {
  words: {
    [key: string]: number,
  },
}

export function useGetWordcloudQuery(params: GetWordcloudParams) {
  return useQuery(['wordcloud', params], async () => {
    return (await axiosInstance.get('/api/sdb/wordcloud', { params })).data as GetWordcloudResponse;
  }, {
    retry: false,
  });
}
