import {
  Box,
  Button,
  Grid,
  IconButton,
  createTheme,
} from "@mui/material";
import './styles.css';
import DataGrid, { DataGridColumn } from "../../components/DataGrid";
import { useGetScannedURLsQuery } from "../../common/api";
import { SearchCard } from "../../components/SearchCard";
import { PlatformKindIcon } from "../../components/PlatformKindIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Search } from "@mui/icons-material";
import AnalyticsIcon from '@mui/icons-material/Analytics';

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
      key: 'device', header: 'Device',size:50, cell: ({ cellValue,row }) => {

        return <PlatformKindIcon platform={row.original.device}/> ;
      }
    },
    { key: 'url', header: 'URL' },
    { key: 'batch_uuid', header: 'Batch UUID' },
    { key: 'scan_uuid', header: 'scan UUID' },
    { key: 'insert_time', header: 'Upload Time' },
    { 
      key: 'label', 
      header: 'Label',
      cell: ({ cellValue, row }) => (
        <Button variant="outlined" sx={{ textTransform: 'none' }} style={{ backgroundColor: row.original.label === "Benign" ? '#316b5f' : row.original.label === 'Malicious' ? '#653846' : '#b8b8b8', color: 'white', borderRadius: '20px',width:"10rem" }}>
          {row.original.label}
        </Button>
      )
     },
     {
      key: 'analyze', 
      header: 'Analyze',
      cell: ({ row }) => {
          const navigate = useNavigate();

          const handleRedirect = () => {
              navigate(`/analysis/${row.original.scan_uuid}/${row.original.device}`);
          };

          return (
            <Button onClick={handleRedirect} variant="outlined" style={{ textTransform: 'none', color: 'white', borderRadius: '20px' }}>
              <AnalyticsIcon/>
            </Button>
          );
      },
    }
  ]

  // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
  const { data, isLoading } = useGetScannedURLsQuery<ScannedURLInfo[]>({});
  const [filteredData, setFilteredData] = useState<ScannedURLInfo[]>();

  const receiveDataFromChild = (data:any) => {
    setFilteredData(data);
  };
  
  return (
    <Box sx={{ m: 5 }}>
      <Grid item sx={{ mt: 1, position: 'relative' }} spacing={3}>
          <SearchCard disabled={false} placeholder="Enter URL ..." onURLSubmit={() => { }} sendFilteredData={receiveDataFromChild} submitIcon={<Search/>}/>
      </Grid>
      <Grid item  sx={{ mt: 5, position: 'relative' }}>
        <DataGrid<ScannedURLInfo> theme={dataGridTheme} columns={columns} data={data} isLoading={isLoading} title="All Scanned URLs"/>
      </Grid>

    </Box>
  );
}

