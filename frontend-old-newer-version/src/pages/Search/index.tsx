import {
  Box,
  Grid,
  Stack,
  Typography,
  createTheme,
} from "@mui/material";
import './styles.css';
import DataGrid, { DataGridColumn, DataGridRefreshRate } from "../../components/DataGrid";
import { useGetExecutionQuery, ExecutionsParams, useGetScannedURLsQuery } from "../../common/api";
import { SearchCard } from "../../components/SearchCard";
import { PlatformKind, PlatformKindIcon } from "../../components/PlatformKindIcon";


type ScannedURLInfo = {
  batch_uuid: string;
  device: string;
  url: string;
  scan_uuid: string;
  insert_time: string;
  label: string;
};
export default function SearchPage() {


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


  const columns: DataGridColumn<ScannedURLInfo>[] = [
    {
      key: 'device', header: 'Device',size:1, cell: ({ cellValue,row }) => {

        return <PlatformKindIcon platform={row.original.device}/> ;
      }
    },
    { key: 'url', header: 'URL' },
    { key: 'batch_uuid', header: 'Batch UUID' },
    { key: 'scan_uuid', header: 'scan UUID' },
    { key: 'insert_time', header: 'Upload Time' },
    { key: 'label', header: 'Label' }
  ]

  // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
  const { data, isLoading } = useGetScannedURLsQuery<ScannedURLInfo[]>({});
  return (
    <Box sx={{ m: 5 }}>
      <Grid item sx={{ mt: 1, position: 'relative' }} spacing={3}>
          <SearchCard disabled={false} placeholder="Enter URL ..." onURLSubmit={() => { }}

          />
      </Grid>
      <Grid item  sx={{ mt: 5, position: 'relative' }}>
        <DataGrid<ScannedURLInfo> theme={dataGridTheme} columns={columns} data={data} isLoading={isLoading} title="All Scanned URLs" />
      </Grid>


    </Box>
  );
}

