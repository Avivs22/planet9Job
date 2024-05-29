import { Box, Button, createTheme, Grid } from "@mui/material";
import PercentageBar from "../../components/PercentageBar";
import DataGrid, { DataGridColumn } from "../../components/DataGrid";
import { useGetBatchInfoQuery } from "../../common/api";
import { PlatformKindIcon } from "../../components/PlatformKindIcon";
import { useNavigate, useParams } from 'react-router-dom';

type BatchInfo = {
    device: string;
    url: string;
    status: string;
    ood_classification: string;
    scams_classification: string;
    enticement_method_classification: string;
    scan_uuid: string;
};

interface InferencePageParams {
  batch_uuid: string;
}

const InferencePage: React.FC = () => {
    const { batch_uuid } = useParams<InferencePageParams>();
    const dataGridTheme = createTheme({
        palette: {
          mode: 'dark',
          background: {
            default: '#ffffff20',
            paper: '#333',
          },
        },
        components: {
          // MuiTableCell: {
          //   styleOverrides: {
          //     root: {
    
          //       '&.MuiTableCell-sizeMedium ': {
          //         maxWidth:'100%'
    
          //       },
          //     },
    
          //   }
    
          // },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              }
            }
          },
    
        }
      });
      const columns: DataGridColumn<BatchInfo>[] = [
        {
          key: 'device', header: 'Device',size:1, cell: ({ cellValue,row }) => {
    
            return <PlatformKindIcon platform={row.original.device}/> ;
          }
        },
        { key: 'url', header: 'URL' },
        { 
            key: 'status', 
            header: 'Status',
            cell: ({ cellValue, row }) => (
                <Button 
                  size="small" 
                  variant="outlined"
                  style={{ 
                    backgroundColor: row.original.status === "Done" ? "#316b5f" : 
                     row.original.status === "Inference" ? '#7c7097' : 
                     row.original.status === "Crawler" ? '#506f8e' : 
                     '#647284',
                    color: 'white',
                    borderRadius: '20px', 
                    textTransform: 'none' 
                  
                  }}>
                  {row.original.status}
                </Button>
            )
        },
        { 
            key: 'ood_classification', 
            header: 'OOD',
            cell: ({ cellValue, row }) => (
                <Button 
                  size="small" 
                  variant="outlined" 
                  style={{ 
                    backgroundColor: row.original.ood_classification === "Not OOD" ? "#316b5f" : 
                    row.original.ood_classification === "OOD" ? '#653846' :  
                    '#647284', 
                    color: 'white', 
                    borderRadius: '20px', 
                    textTransform: 'none' 
                  }}>
                  {row.original.ood_classification}
                </Button>
            ) 
            
        },
        { 
            key: 'scams_classification', 
            header: 'Benign/Malicious',
            cell: ({ cellValue, row }) => (
                <Button 
                  size="small" 
                  variant="outlined" 
                  style={{ 
                    backgroundColor: row.original.scams_classification === "Benign" ? "#316b5f" : 
                    row.original.scams_classification === "Malicious" ? '#653846' :  
                    row.original.scams_classification === "Not Inferenced Yet" ? '#647284' :  
                    '#71725f', 
                    color: 'white', 
                    borderRadius: '20px', 
                    textTransform: 'none' 
                  }}>
                  {row.original.scams_classification}
                </Button>
            ) 
            
        },
        { 
            key: 'enticement_method_classification', 
            header: 'Enticement Method',
            cell: ({ cellValue, row }) => (
                <Button 
                  size="small" 
                  variant="outlined" 
                  style={{ 
                    backgroundColor: row.original.enticement_method_classification === "Adult Content & Dating" ? "#7c7097" : 
                    row.original.enticement_method_classification === "Finance & Banking" ? '7d5f72' :  
                    row.original.enticement_method_classification === "Job Scam" ? '#8b7463' :  
                    row.original.enticement_method_classification === "Business & E-Commerce" ? '#63888b' :  
                    row.original.enticement_method_classification === "Other" ? '#726f7a' : 
                    row.original.enticement_method_classification === "Benign" ? '#316b5f' : 
                    row.original.enticement_method_classification === "URL is OOD" ? '#71725f' :  
                    '#647284', 
                    color: 'white', 
                    borderRadius: '20px', 
                    textTransform: 'none' 
                  }}>
                  {row.original.enticement_method_classification}
                </Button>
            ) 
            
        },
        { key: 'scan_uuid', header: 'Scan_uuid' },
        { 
          key: 'analyze', 
          header: 'Analyze',
          cell: ({ cellValue, row }) => {
            const navigate = useNavigate();
            const handleRedirect = () => {
              navigate(`/analysis/${row.original.scan_uuid}/${row.device}`);
            };
            return (
              <Button onClick={handleRedirect} variant="outlined" style={{ textTransform: 'none', backgroundColor: row.original.label === "Benign" ? 'blue' : row.original.label === 'Malicious' ? 'purple' : 'black', color: 'white', borderRadius: '20px' }}>
                Analyze
              </Button>
            )
          }
         }
      ]
    
      const { data, isLoading } = useGetBatchInfoQuery<BatchInfo[]>({batch_uuid});
      console.log("data", data)
    return (
        <Box sx={{ m: 5 }}>
            <Grid item sx={{ mt: 1, position: 'relative' }} spacing={3}>
                <PercentageBar />
            </Grid>
            <Grid item  sx={{ mt: 5, position: 'relative' }}>
                <DataGrid<BatchInfo> theme={dataGridTheme} columns={columns} data={data} isLoading={isLoading} title="All Scanned URLs" />
            </Grid>


        </Box>
    )
}
export default InferencePage;
