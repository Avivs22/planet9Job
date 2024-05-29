import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  createTheme,
} from "@mui/material";
import './styles.css';
import DataGrid, { DataGridColumn, DataGridRefreshRate } from "../../components/DataGrid";
import { useGetExecutionQuery, ExecutionsParams } from "../../common/api";
import { SearchCard } from "../../components/SearchCard";
import { Upload } from "@mui/icons-material";
import axios from "axios";
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import Papa from 'papaparse';

type ExecutionInfo = {
  batch_uuid: string;
  name: string;
  inserted_at: string;
  single_or_batch: string;
  batch_size: number;
  is_file: boolean
};

interface RawInputItem {
  raw_input: string;
  use_proxies?: boolean;
  proxies?: string[];
  crawling_max_depth?: number;
  priority?: number;
  env?: string[];
  source?: string;
}

interface BatchRawInput {
  raw_inputs: RawInputItem[];
  name: string;
}


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
    { 
      key: 'single_or_batch', 
      header: 'Single/Batch', 
      cell: (row: any) => (
        <Button variant="outlined" style={{ backgroundColor: row.row.original.batch_size > 1 ? '#6ab4ff' : '#bfa8ff', color: 'white', borderRadius: '20px' }}>
          {row.row.original.batch_size > 1 ? 'Batch' : 'Single URL'}
        </Button>
      )
    },
    { key: 'batch_size', header: 'Batch Size' },
    { key: 'name', header: 'Name' },
    { 
      key: 'is_file', 
      header: 'Is File',
      cell: (row: any) => (
        <>
          {row.row.original.is_file === true ? <ContentPasteSearchOutlinedIcon /> : null}
        </>
        
      )
     }
  ]

  const refreshRates: DataGridRefreshRate[] = [
    { value: '5s' },
    { value: '10s', isDefault: true },
    { value: '30s' },
    { value: '1m' }
  ];

  const handleFileSubmit = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('batch_raw_input', JSON.stringify({ raw_inputs: [], name: file.name }));

    try {
      const response = await axios.post('/api/submit_batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful', response.data);
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };
  // const handleFileSubmit = async (file: File) => {
  //   Papa.parse(file, {
  //     complete: async (results: any) => {
  //       const rawInputs: RawInputItem[] = results.data.map((row: any) => ({
  //         raw_input: row[0], // Adjust the index based on your CSV structure
  //         use_proxies: raw[1],
  //         proxies: [],
  //         crawling_max_depth: 0,
  //         priority: 0,
  //         env: [],
  //         source: ''
  //       }));

  //       const batchRawInput: BatchRawInput = {
  //         raw_inputs: rawInputs,
  //         name: file.name
  //       };

  //       try {
  //         const response = await axios.post('/api/submit_batch', batchRawInput, {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         });
  //         console.log('Upload successful', response.data);
  //       } catch (error) {
  //         console.error('Error uploading file', error);
  //       }
  //     }
  //   });
  // };

  // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
  const { data, isLoading } = useGetExecutionQuery<ExecutionInfo[]>({ refreshInterval: 5000 } as ExecutionsParams);
  // console.log(data)
  return (
    <Box sx={{ m: 5 }}>
      <Grid container sx={{ mt: 1, position: 'relative' }} spacing={3}>
        <Grid item xs={12}>
          <SearchCard disabled={false} placeholder="Enter URL or Drag & drop csv file" onURLSubmit={() => { }} onFileSubmit={handleFileSubmit}
            submitIcon={<Upload />}
          />
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ mt: 5, position: 'relative' }}>
        <DataGrid<ExecutionInfo> theme={dataGridTheme} columns={columns} refreshRates={refreshRates} data={data} isLoading={isLoading} title="Recently Uploaded" />
      </Grid>


    </Box>
  );
}

