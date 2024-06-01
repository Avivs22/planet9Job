import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,} from "@mui/material";

import {  useQuery } from "react-query";
import { useAtomValue,  } from "jotai";

import {
  retriveModelIpInfoElement,
} from '../common/api.ts';
import { clickedButtonIndexAtom } from '../common/state';


interface GetIPInfoParams {
  enviroment?:string
  scan_uuid?:string
  redictrion_idx:number
  depth:number
  }
  
  function useGetIPInfoQuery(params: GetIPInfoParams, enabled: boolean) {
    return useQuery(['IPInfo', params], () => retriveModelIpInfoElement<IPInfoResponse>(params), {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    });
  }
  
  interface IPInfoResponse {
    ip: string;
    hostname: string;
    anycast: boolean;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    readme: string;
}

interface Column {
  key: string;
  label: string;
}

const IPINFO_COLUMNS: Column[] = [
  { key: 'ip', label: 'IP Address' },
  { key: 'hostname', label: 'Hostname' },
  { key: 'anycast', label: 'Anycast' },
  { key: 'city', label: 'City' },
  { key: 'region', label: 'Region' },
  { key: 'country', label: 'Country' },
  { key: 'loc', label: 'Location' },
  { key: 'org', label: 'Organization' },
  { key: 'postal', label: 'Postal Code' },
  { key: 'timezone', label: 'Timezone' },
  { key: 'readme', label: 'Readme URL' }
];

  
  function IPInfo({scan_uuid, enviroment}: {scan_uuid?: string, enviroment?: string}) {
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);
    const { data, isLoading,error } = useGetIPInfoQuery({ scan_uuid: scan_uuid, enviroment: enviroment,redictrion_idx:redirect_idx || 0,depth:0 },!!scan_uuid); 
    console.log('My Data ',data?.anycast)   
    return (
      <Card
        className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
        sx={{
          p: 2, width:"50%", height:"450px" 
        }}
      >
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{ mb: 2 }}
        >
          IPInfo
        </Typography>
        <Box sx={{
          overflow: 'auto',
          height: '85%',
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
              {IPINFO_COLUMNS.map((column) => (
                <TableRow key={column.key}>
                  <TableCell
                    sx={{
                      textAlign: 'left',
                      color: 'white',
                      width: 100,
                    }}
                  >
                    <b>{column.label}</b>
                  </TableCell>
                  <TableCell sx={{ color: 'white' , whiteSpace:'pre-wrap'}}>
                    {isLoading && <CircularProgress size={16} />}
                    {/* {!isLoading && data?.whois && (data?.whois?.[column.key] ?? 'N/A')} */}
                    {!isLoading && data && (data[column.key as keyof IPInfoResponse].toString() ?? 'N/A')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    );
  }
export default IPInfo;
