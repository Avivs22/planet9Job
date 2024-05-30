import {
  Alert,
  Box,
  Card,
  CircularProgress, Divider,
  Grid,
  IconButton, MenuItem, Select,
  Stack, SxProps,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,} from "@mui/material";


import { useSearchParams } from 'react-router-dom';

import {  useQuery } from "react-query";
import { useAtomValue,  } from "jotai";

import {
  retriveModelInferenceDataElement
} from '../common/api/investigateApi.ts';
import { clickedButtonIndexAtom } from '../common/state';

interface GetWhoisParams {
    url: string;
  }
  
  interface GetWhoisResponse {
    whois: {
      domain: string;
      registrar: null | string;
      registrant_country: null | string;
      creation_date: null | string;
      expiration_date: null | string;
      last_updated: null | string;
    }
  }
  
  interface GetWhoisQueryResponse {
    scan_uuid: string;
    timestamp: string;
    elapsed_time_seconds: number;
    errors: string[];
    domain: string;
    url: string;
    result: string;
    year: number;
    month: number;
    day: number;
  }
  
  function useGetWhoisQuery(params: GetWhoisParams, enabled: boolean) {
    return useQuery(['whois', params], async () => {
      // return (await axios.get('/api/whois', { params })).data as GetWhoisResponse;
      // return (await axios.get('/api/athena/full-whois', { params })).data as GetWhoisQueryResponse[];
      //return (await axios.get('/api/athena/whois', { params })).data as GetWhoisQueryResponse[];
  
  
  
      return new Promise<string[]>((res, req) => {
        setTimeout(() => {
          const data = retriveModelInferenceDataElement(params.url)
          res({ info: [data?.t0_whois] } as any)
          // } else {
          //   res([])
          // }
        }, 3000)
      })
  
    }, {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    });
  }
  
  interface WhoIsInfo {
    scan_uuid: string;
    timestamp: string;
    elapsed_time_seconds: string;
    errors: string;
    domain: string;
    name: string;
    ltd: string;
    registrar: string;
    registrar_country: string;
    creation_date: string;
    expiration_date: string;
    last_updated: string;
    status: string;
    statuses: string;
    dnssec: string;
    name_servers: string;
    registrant: string;
    emails: string;
  }
  
  const WHOIS_COLUMNS = [
    { key: "scan_uuid", name: "Scan UUID" },
    { key: "timestamp", name: "Timestamp" },
    { key: "elapsed_time_seconds", name: "Elapsed Time (seconds)" },
    { key: "errors", name: "Errors" },
    { key: "domain", name: "Queried Domain" },
    { key: "name", name: "Name" },
    { key: "ltd", name: "LTD" },
    { key: "registrar", name: "Registrar" },
    { key: "registrar_country", name: "Registrar Country" },
    { key: "creation_date", name: "Creation Date" },
    { key: "expiration_date", name: "Expiration Date" },
    { key: "last_updated", name: "Last Updated" },
    { key: "status", name: "Status" },
    { key: "statuses", name: "Statuses" },
    { key: "dnssec", name: "DNS sec" },
    { key: "name_servers", name: "Name Servers" },
    { key: "registrant", name: "Registrant" },
    { key: "emails", name: "Emails" },
  ]
  
  function WhoisCard({scan_uuid, device,redirect_udx}: {scan_uuid: string, device: string, redirect_udx: number}) {
    const result = useAtomValue(inferenceResultAtom);
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
  
    const { data, isLoading } = useGetWhoisQuery({
      url: url ?? '',
      use_db: true,
    }, !!url);
  
    return (
      <Card
        className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
        sx={{
          p: 2, height: '100%'
        }}
      >
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{ mb: 2 }}
        >
          WHOIS
        </Typography>
        <Box sx={{
          overflow: 'auto',
          height: '85%'
        }}>
          <Table
            size="small"
            sx={{
              backgroundColor: '#ffffff30',
              borderRadius: 3,
            }}>
            <colgroup>
              <col style={{ width: '40%' }} />
            </colgroup>
  
            <TableBody>
              {WHOIS_COLUMNS.map((column) => (
                <TableRow key={column.key}>
                  <TableCell
                    sx={{
                      textAlign: 'left',
                      color: 'white',
                      width: 100,
                    }}
                  >
                    <b>{column.name}</b>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {isLoading && <CircularProgress size={16} />}
                    {/* {!isLoading && data?.whois && (data?.whois?.[column.key] ?? 'N/A')} */}
                    {!isLoading && data?.info && (data?.info[0][column.key] ?? 'N/A')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    );
  }