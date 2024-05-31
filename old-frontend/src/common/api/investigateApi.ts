import { useQuery } from "react-query";
import { FormValues, FormValue } from "../../dialogs/ViewAnalyst";
import * as stubConfig from "../../oriel-consts"
import axios from "axios";

export interface GetBaseQueryParams {
    url: string;
    use_db?: boolean;
}
  
export interface GetIPInfoQueryResponse {
  scan_uuid: string;
  timestamp: string;
  is_proxy: boolean;
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  readme: string;
  // elapsed_time_seconds: number;
  // errors: string[]; // Assuming 'errors' is an array of strings, adjust if it's a different type
  // domain: string;
  // url: string;
  // result: string; // Assuming 'result' is a string, adjust if it's a structured object or another type
  year: number;
  month: number;
  day: number;
}

  
// export const IPInfo = {
//   "ip": "128.199.78.87",
//   "city": "Singapore",
//   "region": "Singapore",
//   "country": "SG",
//   "loc": "1.3215,103.6957",
//   "org": "AS14061 DigitalOcean, LLC",
//   "postal": "627753",
//   "timezone": "Asia/Singapore",
//   "readme": "https://ipinfo.io/missingauthmissingauthmissingauthmissingauthmissingauthmissingauthmissingauthmissingauthmissingauthmissingauth"
// }

export function useIPInfoQuery(params: GetBaseQueryParams, enabled: boolean) {
  return useQuery(['ip-info', params], async () => {
    return new Promise<string[]>((res, rej) => {
      setTimeout(() => {
        const data = retriveModelInferenceDataElement(params.url)
        res({info: [data?.t0_ipinfo]} as any)
      }, 3000)
    })
    // return new Promise<FormValues<FormValue<string>>>((res, rej) => {
    //   setTimeout(() => {
    //     res((stubConfig.IPInfo) as any)
    //   }, 3000)
    // })
    // try {
      //return (await axios.get('/api/athena/ip-info', { params })).data as GetIPInfoQueryResponse[];
    // } catch (error: any) {
    //   if (axios.isAxiosError(error) && error.response) {
    //     const message = error.response.data?.detail || error.response.data;
    //     return message;
    //   }
    //   throw error;
    // }

    // return (await axios.get('/api/ip-info', { params })).data as IPInfo;
  }, {
    enabled: true,
    // enabled,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}



export interface GetFaviconQueryResponse {
    // TODO implement
}
  
export function useFaviconQuery(params: GetBaseQueryParams) {
  return useQuery(['favicon', params], async () => {
    // try {
      return (await axios.get('/api/athena/favicon', { params })).data as GetFaviconQueryResponse;
    // } catch (error: any) {
    //   if (axios.isAxiosError(error) && error.response) {
    //     const message = error.response.data?.detail || error.response.data;
    //     return message;
    //   }
    //   throw error;
    // }
  }, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

export function usePredictQuery(params: GetBaseQueryParams) {
  return useQuery(['predict', params], async () => {
      return (await axios.post('/api/predict', params)).data as any;
  }, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}


export interface PredictV2Response {
  url: null | string;
  input: null | string;
  prediction: null | {
    logits: number[][];
  };
}

export function usePredictV2Query(params: GetBaseQueryParams, enabled: boolean) {
  return useQuery(['predict-v2', params], async () => {
    return (await axios.post('/api/v2/predict', params)).data as PredictV2Response;
  }, {
    enabled,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

export interface GetScreenshotQueryResponse {
  info: any;
}

export function useScreenshotQuery(params: GetBaseQueryParams) {
return useQuery(['screenshot', params], async () => {
  // try {
    //return (await axios.get('/api/athena/screenshot', { params })).data as GetScreenshotQueryResponse;
  // } catch (error: any) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     const message = error.response.data?.detail || error.response.data;
  //     return message;
  //   }
  //   throw error;
  // }

  return new Promise<string[]>((res, rej) => {

    setTimeout(() => {
      const data = retriveModelInferenceDataElement(params.url)

      const modifiedScreenshotData = {
        desktop:{screenshot:data?.t0_screenshot.find(x=>x.environment=="desktop")?.saved_or_error},
        android:{screenshot:data?.t0_screenshot.find(x=>x.environment=="android")?.saved_or_error},
        iphone:{screenshot:data?.t0_screenshot.find(x=>x.environment=="iphone")?.saved_or_error}
      }
      res({info: modifiedScreenshotData} as any)
    }, 3000)
  })
  
}, {
  enabled: true,
  refetchOnWindowFocus: false,
  retry: 0,
});
}

export interface GetExternalLinksQueryResponse {
    // TODO implement
  }
  
export interface GetLinksQueryParams extends GetBaseQueryParams {
  url: string;
  type: string
}
  
  
export function useLinksQuery(params: GetLinksQueryParams, enabled: boolean) {
    return useQuery(['links', params], async () => {
  
      switch (params.type) {
        case "Outer Links":
          //return (await axios.get('/api/athena/outer-links', { params })).data.info as GetScreenshotQueryResponse;
          return new Promise<string[]>((res, rej) => {
            setTimeout(() => {
              const data = retriveModelInferenceDataElement(params.url)
              res(data?.t0_html[0].urls as any)
            }, 3000)
          })
          
        case "Additional Analysis":
          return new Promise<{ [key: string]: string } | string[]>((res, rej) => {
            // try {
                const parsedUrl = new URL(params.url ?? '');
                const domain = parsedUrl.hostname;
                res({
                  'Link to ScamAdviser': `https://www.scamadviser.com/check-website/${domain}`,
                  'Link to URLVoid': `https://www.urlvoid.com/scan/${domain}`,
                  'Link to scamalert': "https://www.scamalert.sg/",
                  'Link to Checkphish': "https://checkphish.ai/",
                  'Link to Perplexity': "https://www.perplexity.ai/",
                  'Link to Polyswarm': "https://polyswarm.network/",
                })
            // } catch (error) {
            //     res(['Error Invalid URL: ' + error])
            // }
          })
        default:
          return new Promise<string[]>((res, rej) => {
            setTimeout(() => {
              res([])
            }, 3000)
          })
      }
      //return (await axios.get('/api/dns', { params })).data as GetExternalLinksQueryResponse;
    }, {
      enabled: true,
      // enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    });
}

export interface GetDNSQueryResponse {
    // TODO implement
  }

export const retriveModelInferenceDataElement = (url:string)=>{
  for (let i = 0; i < stubConfig.modelUnferenceInvestigateData.length; i++) {
      if(stubConfig.modelUnferenceInvestigateData[i].url == url){
        return stubConfig.modelUnferenceInvestigateData[i]
      }
    
  }
  return undefined
}
export function useDNSQuery(params: GetBaseQueryParams, enabled: boolean) {
    return useQuery(['dns', params], async () => {
      return new Promise<object>((res, rej) => {
        setTimeout(() => {
          res(Object.entries(stubConfig.DNS).reduce((acc: any, [key, value]) => {
            if (value.data && value.data.resolve !== undefined) {
              acc[key] = value;
            }
            return acc;
          }, {}))
        }, 3000)
      })
      //return (await axios.get('/api/dns', { params })).data as GetDNSQueryResponse;
    }, {
      enabled: true,
      // enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    });
  }


  export interface ModelInferenceResult {
    URL: string,
    classification: string
  }

  export interface GetModelInferenceQueryResponse {
    info: any;
  }
    
  export function useModelInferenceQuery(params: GetBaseQueryParams, enabled: boolean) {
    return useQuery(['dns', params], async () => {
      return new Promise<ModelInferenceResult[]>((res, rej) => {
        setTimeout(() => {
          res(stubConfig.modelInferenceData as unknown as ModelInferenceResult[])
        }, 3000)
      })
      //return (await axios.get('/api/dns', { params })).data as GetExternalLinksQueryResponse;
    }, {
      enabled: true,
      // enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    });
  }
    
export interface GetRawJsonQueryResponse {
    // TODO implement
  }
  
export function useRawJsonQuery(params: GetBaseQueryParams, enabled: boolean) {
    return useQuery(['raw-json', params], async () => {
      return new Promise<any>((res, rej) => {
        setTimeout(() => {
          res((stubConfig.rawJson) as any)
        }, 3000)
      })
      //return (await axios.get('/api/raw-json', { params })).data as GetRawJsonQueryResponse;
    }, {
      enabled: true,
      // enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    });
  }
  