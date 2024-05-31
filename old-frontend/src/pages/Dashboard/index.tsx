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


type ExecutionInfo = {
  batch_uuid: string;
  name: string;
  upload_time: string;
  is_batch: string;
  inference: string
};


export default function DashboardPage() {


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
    { key: 'upload_time', header: 'Upload Time' },
    { key: 'is_batch', header: 'Single / Batch' },
    { key: 'name', header: 'Name' },
    { key: 'inference', header: 'Inference' }
  ]

  const refreshRates: DataGridRefreshRate[] = [
    { value: '5s' },
    { value: '10s', isDefault: true },
    { value: '30s' },
    { value: '1m' }
  ];
  const { data, isLoading } = useGetExecutionQuery<ExecutionInfo[]>({ refreshInterval: 5000 } as ExecutionsParams);
  console.log(data)
  return (
    <Box sx={{ m: 5 }}>
      <Stack direction="row" alignItems="baseline">
        <Typography variant="h4">
          Dashboard
        </Typography>

      </Stack>
      <Grid container xs={12} sx={{ mt: 8, position: 'relative' }}>
        <DataGrid<ExecutionInfo> theme={dataGridTheme} columns={columns} refreshRates={refreshRates} data={data} isLoading={isLoading} />
      </Grid>

    </Box>
  );
}

