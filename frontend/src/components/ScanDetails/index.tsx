import React from 'react';
import './styles.css';
import { createTheme, Grid, Typography } from '@mui/material';
import { DataGridColumn } from '../DataGrid';
import { PlatformKindIcon } from '../PlatformKindIcon';
import { useParams } from 'react-router-dom';
import { useGetScanDetailsInfoQuery } from '../../common/api';

type ScanDetailsInfo = {
    url: string;
    raw_input: string;
    scan_uuid: string;
    enviroment: string;
};

interface ScanDetailsComponentParams {
    scan_uuid: string;
    enviroment: string;
}

const ScanDetails = () => { 
      const { scan_uuid, enviroment } = useParams<ScanDetailsComponentParams>();

      // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
      const { data, isLoading } = useGetScanDetailsInfoQuery<ScanDetailsInfo[]>({ scan_uuid, enviroment });
      
      return (
        // <Box sx={{ m: 5 }}>
        <div className="scan-info">
            <h1 className="url">{data?.url}</h1>
            <div className="details">
                <div className="detail">Scan Date – {data?.raw_input}</div>
                <div className="detail">Scan_UUID – {data?.enviroment}</div>
                <div className="detail">
                <div className='icon'>
                    <PlatformKindIcon platform="desktop"/> 
                    <span style={{ marginLeft: "10px" }}>Scanned from Desktop</span>
                </div>
                </div>
            </div>
        </div>
    
    
        // </Box>
      );
};

export default ScanDetails;
