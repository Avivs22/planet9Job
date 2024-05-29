import { Box, Button, createTheme, Grid } from "@mui/material";
import PercentageBar from "../../components/PercentageBar";
import DataGrid, { DataGridColumn } from "../../components/DataGrid";
import { useGetBatchInfoQuery } from "../../common/api";
import { PlatformKindIcon } from "../../components/PlatformKindIcon";
import { useParams } from 'react-router-dom';
import ScanDetails from "../../components/ScanDetails";
import ModelPrediction from "../../components/ModelPrediction";
import RedirectBar from "../../components/RedirectBar";
import SunburstChart from "../../components/SunburstChart";
import SunburstChartComponent from "../../components/Sunburst";

const AnalysisPage: React.FC = () => {
    const handleSunburstClick = (data: any) => {
        console.log('Sunburst segment clicked:', data);
    };
    
    return (
        <Box sx={{ m: 5 }} style={{ display: 'flex', flexDirection: 'column' }}>
            <ScanDetails />
            <ModelPrediction />
            <RedirectBar />
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
