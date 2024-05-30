
import PercentageBar from "../../components/PercentageBar";
import DataGrid, { DataGridColumn } from "../../components/DataGrid";
import { useGetBatchInfoQuery } from "../../common/api";
import { PlatformKindIcon } from "../../components/PlatformKindIcon";
import { useParams } from 'react-router-dom';
import ScanDetails from "../../components/ScanDetails";
import ModelPrediction from "../../components/ModelPrediction";
import RedirectBar from "../../components/RedirectBar";
import ScreenShotCard from "../../components/Screenshot.tsx"
import SunburstChart from "../../components/SunburstChart";
import SunburstChartComponent from "../../components/Sunburst";
// import SSLCertificate from "../../components/SSLCertificate.tsx"
import WHOIS from "../../components/WHOIS.tsx"
import ExternalLinks from "../../components/ExternalLinks.tsx"

type AnalysisParams =  {
  scan_uuid: string;
  device: string;
};

import { useAtomValue } from 'jotai'
import {   Box,
  } from "@mui/material";

const AnalysisPage: React.FC = () => {
    const handleSunburstClick = (data: any) => {
        console.log('Sunburst segment clicked:', data);
    };
    const { scan_uuid, device } = useParams<AnalysisParams>();
    
    return (
        <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <ScanDetails /> */}
            <ModelPrediction />
            <RedirectBar />
            <ScreenShotCard />
            {/* <SSLCertificate/> */}
            {/* <WHOIS/> */}
            {/* <ExternalLinks/> */}

            <div>
                <h1>Sunburst Chart Example</h1>
                <SunburstChartComponent />
            </div>
            {/* <SunburstChart
                sampleIdx={0} // Index of the sample to visualize
                countBy="size" // Property to count by
                dataKey="name" // Key in the data to use for the segments
                onClick={handleSunburstClick} // Click handler function
            /> */}
        </Box>
    )
}
export default AnalysisPage;
