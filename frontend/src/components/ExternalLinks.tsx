import {
  Card,
  Stack,
  Typography,} from "@mui/material";


import {  useQuery } from "react-query";
import { useAtomValue,  } from "jotai";
import { clickedButtonIndexAtom } from '../common/state';
import { retriveModelExternalLinksElement } from '../common/api.ts';

interface GetExternalLinksParams {
  enviroment?:string
  scan_uuid?:string
  redictrion_idx:number
  depth:number
  }
  
interface GetExternalLinksResponse {
    links: {
      [name: string]: string;
    }
  }
  
  function useGetExternalLinksQuery(params: GetExternalLinksParams, enabled: boolean) {
    return useQuery(['externallinks', params], () => retriveModelExternalLinksElement<GetExternalLinksResponse>(params), {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    });
  }
  
  function ExternalLinksCard({scan_uuid, enviroment}: {scan_uuid?: string, enviroment?: string}) {
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);
    const { data, isLoading,error } = useGetExternalLinksQuery({ scan_uuid: scan_uuid, enviroment: enviroment,redictrion_idx:redirect_idx || 0,depth:0 },!!scan_uuid);
    return (
      <Card
        className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
        sx={{ p: 2 , width:"15%",height:"450px" }}
      >
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{ mb: 4 }}
        >
          External Links
        </Typography>
  
        <Stack alignItems="center" spacing={1}>
          {data?.links && Object.entries(data?.links).map((link, i) => (
            <Typography
              component="a"
              key={i}
              color="#ccc"
              sx={{ textDecoration: 'underline',p:1 }}
              href={link[1]}
              target="_blank"
            >
              Link to {link[0]}
            </Typography>
          ))}
        </Stack>
      </Card>
    );
  }
export default ExternalLinksCard