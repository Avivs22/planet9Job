import {
  Card,
  Stack,
  Typography,} from "@mui/material";


import { useSearchParams } from 'react-router-dom';

import {  useQuery } from "react-query";
import { useAtomValue,  } from "jotai";
import { clickedButtonIndexAtom } from '../common/state';

import axios from "axios";

interface GetExternalLinksParams {
    url: string;
  }
  
  interface GetExternalLinksResponse {
    links: {
      [name: string]: string;
    }
  }
  
  function useGetExternalLinksQuery(params: GetExternalLinksParams, enabled: boolean) {
    return useQuery(['external-links', params], async () => {
      return (await axios.get('/api/external_links', { params })).data as GetExternalLinksResponse;
    }, {
      enabled,
      refetchOnWindowFocus: false,
      retry: 0,
    });
  }
  
  function ExternalLinksCard({scan_uuid, device,redirect_udx}: {scan_uuid: string, device: string, redirect_udx: number}) {
    const result = useAtomValue(inferenceResultAtom);
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);

    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
  
    const { data, isLoading } = useGetExternalLinksQuery({
      url: url ?? '',
    }, !!url);
  
    return (
      <Card
        className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
        sx={{ p: 2 }}
      >
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{ mb: 2 }}
        >
          External Links
        </Typography>
  
        <Stack alignItems="center" spacing={1}>
          {data?.links && Object.entries(data?.links).map((link, i) => (
            <Typography
              component="a"
              key={i}
              color="#ccc"
              sx={{ textDecoration: 'underline' }}
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
  