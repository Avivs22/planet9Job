
import { useParams } from 'react-router-dom';
import ScanDetails from "../../components/ScanDetails";
import ModelPrediction from "../../components/ModelPrediction";
import RedirectBar from "../../components/RedirectBar";
import ScreenShotCard from "../../components/Screenshot.tsx"
import SunburstChart from "../../components/SunburstChart";
import SunburstChartComponent from "../../components/Sunburst";
import SSLCertificate from "../../components/SSLCertificate.tsx"
import WHOIS from "../../components/WHOIS.tsx"
import ExternalLinks from "../../components/ExternalLinks.tsx"
import IPInfo from "../../components/IPInfo.tsx";

type AnalysisParams =  {
  scan_uuid?: string;
  enviroment?: string;
};

import {   Box,
  } from "@mui/material";

const AnalysisPage: React.FC = () => {
    const handleSunburstClick = (data: any) => {
        console.log('Sunburst segment clicked:', data);
    };
    const { scan_uuid, enviroment } = useParams<AnalysisParams>();
    
    return (
        <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'column' }}>
            <ScanDetails />
            <ModelPrediction />
            <RedirectBar />
            <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'row' ,gap:"20px"}}>
                <SSLCertificate scan_uuid={scan_uuid} enviroment={enviroment}/>
                <IPInfo scan_uuid={scan_uuid} enviroment={enviroment}/>
            </Box>
            <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'row' ,gap:"20px"}}>
                <ExternalLinks scan_uuid={scan_uuid} enviroment={enviroment}/>
                <WHOIS scan_uuid={scan_uuid} enviroment={enviroment}/>
                <ScreenShotCard />
            </Box>

            <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'column',gap:"20px"}}>
            <h1 style={{
                 color: "white",
                fontSize: "3rem",
                border: "2px solid white",
                padding: "10px 20px",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                background: "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
                textAlign: "center",
                margin: "20px 0",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "bold"
            }}>
      Explainability
    </h1>
                <SunburstChartComponent />
            </Box>
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
