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

type ScanDetailsComponentParams = {
    scan_uuid: string;
    enviroment: string;
}

const ScanDetails = () => { 
      const { scan_uuid, enviroment } = useParams<ScanDetailsComponentParams>();
      const { data: scanDetailsData, isLoading: isScanDetailsLoading } = useGetScanDetailsInfoQuery<ScanDetailsInfo>({ scan_uuid, enviroment });

      if (isScanDetailsLoading) {
        return <Typography>Loading...</Typography>;
    }
      return (
        // <Box sx={{ m: 5 }}>
        <div className="scan-info">
            <h1 className="url">{scanDetailsData?.url}</h1>
            <div className="details">
                <div className="detail">Scan Date – {scanDetailsData?.url}</div>
                <div className="detail">Scan_UUID – {scanDetailsData?.scan_uuid}</div>
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
