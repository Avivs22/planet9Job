import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,} from "@mui/material";


import { useSearchParams } from 'react-router-dom';

import {  useQuery } from "react-query";
import { useAtomValue,  } from "jotai";

import {
  retriveModelWHOISElement
} from '../common/api.ts';
import { clickedButtonIndexAtom } from '../common/state';


interface GetWhoisParams {
  enviroment?:string
  scan_uuid?:string
  redictrion_idx:number
  depth:number
  }
  
  function useGetWhoisQuery(params: GetWhoisParams, enabled: boolean) {
    return useQuery(['whois', params], () => retriveModelWHOISElement<WhoisResponse>(params), {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    });
  }
  
  interface WhoisResponse {
    domain_name: string;
    registrar: string;
    whois_server: string;
    referral_url: string | null;
    updated_date: string;
    creation_date: string;
    expiration_date: string;
    name_servers: string[];
    status: string[];
    emails: string | null;
    dnssec: string;
    name: string | null;
    org: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    registrant_postal_code: string | null;
    country: string | null;
  }
  interface Column {
    key: keyof WhoisResponse | string;
    name: string;
  }
  const WHOIS_COLUMNS: Column[] = [
    { key: "domain_name", name: "Queried Domain" },
    { key: "registrar", name: "Registrar" },
    { key: "whois_server", name: "WHOIS Server" },
    { key: "referral_url", name: "Referral URL" },
    { key: "updated_date", name: "Last Updated" },
    { key: "creation_date", name: "Creation Date" },
    { key: "expiration_date", name: "Expiration Date" },
    { key: "name_servers", name: "Name Servers" },
    { key: "status", name: "Status" },
    { key: "dnssec", name: "DNS SEC" },
    { key: "name", name: "Name" },
    { key: "org", name: "Organization" },
    { key: "address", name: "Address" },
    { key: "city", name: "City" },
    { key: "state", name: "State" },
    { key: "registrant_postal_code", name: "Postal Code" },
    { key: "country", name: "Country" },
    { key: "emails", name: "Emails" },
  ];
  
  
  function WhoisCard({scan_uuid, enviroment}: {scan_uuid?: string, enviroment?: string}) {
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);
    const { data, isLoading,error } = useGetWhoisQuery({ scan_uuid: scan_uuid, enviroment: enviroment,redictrion_idx:redirect_idx || 0,depth:0 },!!scan_uuid);    
    return (
      <Card
        className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
        sx={{
          p: 2, width:"60%", height:"450px" 
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
                  <TableCell sx={{ color: 'white' , whiteSpace:'pre-wrap'}}>
                    {isLoading && <CircularProgress size={16} />}
                    {/* {!isLoading && data?.whois && (data?.whois?.[column.key] ?? 'N/A')} */}
                    {!isLoading && data && (data[column.key as keyof WhoisResponse] ?? 'N/A')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    );
  }
export default WhoisCard;
