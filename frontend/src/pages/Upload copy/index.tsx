import {
  Box,
  Grid,
  Stack,
  Typography,
  createTheme,
} from "@mui/material";
import './styles.css';
import DataGrid, { DataGridColumn, DataGridRefreshRate } from "../../components/DataGrid";
import { useGetExecutionQuery, ExecutionsParams } from "../../common/api";
import { SearchCard } from "../../components/SearchCard";


type ExecutionInfo = {
  batch_uuid: string;
  name: string;
  inserted_at: string;
  batch_size: number;
  is_file: boolean
};


export default function UploadPage() {


  const dataGridTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#ffffff20',
        paper: '#333',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            width: "100%",
            '&.MuiPopover-paper': {
              width: 'auto',

            },

            borderRadius: '8px',
          },

        }

      },
    }
  });

  const columns: DataGridColumn<ExecutionInfo>[] = [
    { key: 'batch_uuid', header: 'Batch UUID' },
    { key: 'inserted_at', header: 'Upload Time' },
    { key: 'batch_size', header: 'Batch Size' },
    { key: 'name', header: 'Name' },
    { key: 'is_file', header: 'Is File' }
  ]

  const refreshRates: DataGridRefreshRate[] = [
    { value: '5s' },
    { value: '10s', isDefault: true },
    { value: '30s' },
    { value: '1m' }
  ];
  // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
  const { data, isLoading } = useGetExecutionQuery<ExecutionInfo[]>({ refreshInterval: 5000 } as ExecutionsParams);
  return (
    <Box sx={{ m: 5 }}>
      <Grid container sx={{ mt: 1, position: 'relative' }} spacing={3}>
        <Grid item xs={12}>
          <SearchCard disabled={false} placeholder="Enter URL or Drag & drop csv file" onURLUpload={()=>{}} onFileUpload={()=>{}} 

          />
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ mt: 5, position: 'relative' }}>
        <DataGrid<ExecutionInfo> theme={dataGridTheme} columns={columns} refreshRates={refreshRates} data={data} isLoading={isLoading} title="Recently Uploaded" />
      </Grid>


    </Box>
  );
}

