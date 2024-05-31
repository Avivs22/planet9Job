import './styles.css'
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  MenuItem, Select,
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment, CardProps, styled, IconButton,
} from "@mui/material";

import { useMutation } from "react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { LimeTokenScores } from "../../components/Lime.tsx";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import sortIcon from '../../assets/icons/sort-az.svg';


import './styles.css';
import { autoInvestigateUrlAtom, longModeAtom, longModeLockedAtom, selectedModelAtom } from "../../state/ui.ts";
import { SearchCardModel, SearchCardModelRef } from "../../components/SearchCardModel.tsx";

import { ModelType } from '../../state/ui.ts';
import { ViewSearchDialog } from '../../dialogs/ViewSearch.tsx';

import Title from '../../components/Title.tsx';
import { ModelInferenceResult, useModelInferenceQuery } from '../../common/api/investigateApi.ts';
import AtomicSpinner from 'atomic-spinner'
import { SimpleTable, SimpleTableColumn, SimpleTableColumnType } from '../../components/SimpleTable/SimpleTable.tsx';
import { CSVLink } from "react-csv";
import GetAppIcon from '@mui/icons-material/GetApp';
import * as stubConfig from "../../oriel-consts"

interface BasicInfo {
  ip: string;
  alexa: boolean;
}

interface InferenceResult {
  url: string;
  url_format: string;
  true_probability: number;
  confidence: number;
  is_phishing: boolean;
  lime: { explanation: LimeTokenScores };
}


const inferenceResultAtom = atom<undefined | null | InferenceResult | any>(undefined);
const inferenceLoadingAtom = atom(false);

const basicInfoAtom = atom<null | BasicInfo>(null);


interface PredictMutationParams {
  url: string;
  model: ModelType;
}

interface PredictMutationResponse extends InferenceResult {
}

function usePredictMutation() {
  return useMutation({
    mutationFn: async (params: PredictMutationParams) => (await axios.post('/api/predict', params)).data as PredictMutationResponse,
  })
}


interface ModelSelectProps {
  value: ModelType;
  onChange: (value: ModelType) => void;
}

function ModelSelect(props: ModelSelectProps) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Age"
      disabled
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as ModelType)}
      input={
        <OutlinedInput
          startAdornment={
            <InputAdornment position="start">
              <img src={sortIcon} style={{ width: 24, marginLeft: 4 }} />
              <Typography color="#ffffff80" sx={{ ml: 0.5 }}>Model:</Typography>
            </InputAdornment>
          }
          label="Source"
        />
      }
      sx={{
        backgroundColor: '#ffffff20', // match the color from your image
        borderRadius: 8,

        '&.MuiInputBase-root': {
          height: 64,
        },

        '& .MuiOutlinedInput-notchedOutline': {
          border: 'undefined',
        },

        '& .MuiSelect-select': {
          // paddingLeft: '1em', // or any specific padding
          mr: 1,
        },

        '& .MuiSvgIcon-root': {
          right: 14,
        },

        // add drop shadow
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <MenuItem value={ModelType.CONTENT}>Content</MenuItem>
      <MenuItem value={ModelType.BALANCED}>Global</MenuItem>
      <MenuItem value={ModelType.IMBALANCED}>Localized</MenuItem>
    </Select>
  );
}

function InferenceSearchCardModel() {
  const predict = usePredictMutation();
  const searchRef = useRef<null | SearchCardModelRef>(null);
  const [modelType, setModelType] = useAtom(selectedModelAtom);
  const [inferenceResult, updateInferenceResult] = useAtom(inferenceResultAtom);
  const updateInferenceLoading = useSetAtom(inferenceLoadingAtom);
  const setLongModeLocked = useSetAtom(longModeLockedAtom);
  const setBasicInfo = useSetAtom(basicInfoAtom);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isShowCsvUploadDialog, setIsShowCsvUploadDialog] = useState(false);
  const { data, isLoading, refetch } = useModelInferenceQuery({
    url: '',
  }, true);

  // TODO implemention can change based on backend functionalties
  const [file, setFile] = useState<File>();
  const {globalUrls,setGlobalUrls } = useSearch();


  // TODO modify to dialog
  const handleSearch = () => {
    if (searchRef.current?.value) {
      let url = searchRef.current?.value
      // clear state
      setBasicInfo(null);
      if (inferenceResult === null)
        updateInferenceResult(undefined);

      // updateInferenceLoading(!inferenceLoading);
      url = url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
        searchRef.current?.setValue?.(url);
      }

      predict.mutate({ url, model: modelType });
      setLongModeLocked(false);
    }
  };

  // TODO modify to dialog
  const handleCsvSearch = async (urls: any) => {
    setGlobalUrls(urls.map(x=>x.URL))
    updateInferenceResult(undefined)
    updateInferenceLoading(true)
    return new Promise<void>((res, rej) => {
      setTimeout(async () => {
        const resultData = await refetch()
        updateInferenceResult(resultData.data)
        updateInferenceLoading(false)

        res()
      }, 2000)
    })
    // Handle batch search with the different endpoint for CSV URLs
    //performBatchSearch(csvUrls);
    //setCsvUrls([]);

  };


  useEffect(() => {
    updateInferenceLoading(predict.isLoading);

    if (!predict.isSuccess && predict.isError)
      updateInferenceResult(null);
    else if (predict.isSuccess && !predict.isLoading && predict.data) {
      updateInferenceResult(predict.data);
    }
  }, [predict.isLoading, predict.data]);

  const [autoInvestigateUrl, updateAutoInvestigateUrl] = useAtom(autoInvestigateUrlAtom);
  useEffect(() => {
    if (autoInvestigateUrl) {
      const url = autoInvestigateUrl;
      updateAutoInvestigateUrl(null);

      searchRef.current?.setValue?.(url);
      setTimeout(() => {
        handleSearch();
      }, 50);
    }
  }, [autoInvestigateUrl, handleSearch, updateAutoInvestigateUrl]);

  const closetDialog = () => {
    setIsShowDialog(false)
  }
  const openDialog = () => {
    setIsShowDialog(true)
  }

  const closeCsvUploadDialog = () => {
    setIsShowCsvUploadDialog(false)
  }
  const openCsvUploadDialog = () => {
    setIsShowCsvUploadDialog(true)
  }

  const handleFileUpload = (file: File) => {
    setFile(file)
    // Store the URLs for processing upon user action
    //setCsvUrls(urls);
    // Optionally, indicate to the user that URLs are ready for processing
  };


  return (
    <Box

    >
      <SearchCardModel
        onSearch={() => {
          (file && file.name == searchRef.current?.value) ? openCsvUploadDialog() : !!searchRef.current?.value && openDialog()
        }}
        disabled={predict.isLoading}
        onFileUpload={handleFileUpload}
        placeholder="Enter URL or Drag & drop csv file"
        ref={searchRef}
        leftAction={<ModelSelect value={modelType} onChange={(v) => setModelType(v)} />}
      />
      {isShowDialog && <Grid item xs={12}>
        <ViewSearchDialog
          open={isShowDialog}
          onClose={closetDialog}
          search={handleSearch}
        />
      </Grid>}
      {isShowCsvUploadDialog && <Grid item xs={12}>
        <ViewCsvSearchDialog
          file={file}
          open={isShowCsvUploadDialog}
          onClose={closeCsvUploadDialog}
          search={handleCsvSearch}
        />
      </Grid>
      }
    </Box>
  );
}

//target="_blank" rel="noopener noreferrer"

const NavigateLink = ({ to, children }: any) => {
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </a>
  );
};

const columns: SimpleTableColumn[] = [
  {
    key: 'URL',
    label: 'URL'.toUpperCase(),
    type: SimpleTableColumnType.LINK,
    render: (value) => (
      <NavigateLink to={`/dashboard/url/investigate?url=${encodeURIComponent(value)}`}>
        {value}
      </NavigateLink>
    ),
  },
  {
    key: 'classification',
    label: 'Classification'.toUpperCase(),
    type: SimpleTableColumnType.CLASSIFICATION,
    sx: { textAlign: "center" }

  },
  // TODO add when necessary
  // {
  //   key: 'Scan_uuid',
  //   label: 'Scan_uuid'.toUpperCase(),
  //   type: SimpleTableColumnType.TEXT,
  //   sx: { textAlign: "center" }

  // },
  // {
  //   key: 'scan_date',
  //   label: 'scan date'.toUpperCase(),
  //   type: SimpleTableColumnType.DATE,
  //   sx: { textAlign: "center" }

  // },
  // {
  //   key: 'confidence',
  //   label: 'confidence'.toUpperCase(),
  //   type: SimpleTableColumnType.TEXT,
  //   sx: { textAlign: "center" }

  // },
  // {
  //   key: 'prediction',
  //   label: 'prediction'.toUpperCase(),
  //   type: SimpleTableColumnType.DATE,
  //   sx: { textAlign: "center" }

  // },
];
//Scan_uuid, URL, scan date, prediction, confidence
import * as echarts from 'echarts';
import { Classification } from '../../common/types.ts';
import { ViewCsvSearchDialog } from '../../dialogs/ViewCsvSearch.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearch } from '../../common/SearchContext.tsx';

const PieChartComponent = (props: any) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>([])

  const updateChart = (newData) => {
    if (chartRef.current) {
      const myChart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
      const option = {

        animationEasingUpdate: "quadraticIn",
        tooltip: {
          trigger: 'item'
        },
        legend: {
          textStyle: {
            color: "white",
            fontSize: 16
          },
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            top: '12%',
            bottom: '6%',
            radius: ['50%', '100%'],
            avoidLabelOverlap: true,
            padAngle: newData.filter(item => item.value && item.value > 0).length == 1 ? 0 : 2,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              focus: "self",
              scaleSize: 20,
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                color: "white"
              }
            },
            data: newData
            ,
            minAngle: 2,
          }
        ]
      };

      myChart.setOption(option, false);
    }
  };

  useEffect(() => {
    if (props.counters) {
      const newData = props.sectors.map(sector => ({
        ...sector,
        ...(props.counters?.[sector.label] !== undefined && { value: props.counters[sector.label] })
      }));
      setData(newData);
      updateChart(newData)
    }

  }, [props.sectors, props.counters]);


  return (<Box className={!data ? 'loading-base loading-small-blur' : 'loading-base'}
    sx={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {!data ? (
      <Box sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <CircularProgress />
      </Box>
    ) : (
      <div ref={chartRef} style={{ width: '100%', height: '70%' }}></div>
    )}
  </Box>)
};



interface ClassificationCounts {
  [key: string]: number;
}

interface ClassificationProgressComponentProps {
  counters?: ClassificationCounts;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',

  },
}));

interface ProgressParams {
  totalAmount: number;
  proggressSoFarCounter: number;
  calculatedProggress: number
}


const ClassificationProgressComponent = ({ counters }: ClassificationProgressComponentProps) => {
  const [progressParams, setProgressParams] = useState<ProgressParams | undefined>(undefined)

  useEffect(() => {
    if (counters) {
      const counter1 = counters["Benign"] ?? 0;
      const counter2 = counters["Phishing"] ?? 0;
      const counter3 = counters["Unprocessed"] ?? 0;
      const total = counter3 + counter1 + counter2;
      const proggressSoFarCounter = counter1 + counter2;
      setProgressParams({ calculatedProggress: ((proggressSoFarCounter) / (total)) * 100, totalAmount: total, proggressSoFarCounter: proggressSoFarCounter })
    }
  }, [counters])

  return (
    <Box sx={{ flexGrow: 1 }}>

      <Box sx={{ margin: '20px 0', display: 'flex', position: "relative", height: '24px', justifyContent: 'center', justifyItems: 'center' }}>

        <Typography variant="h6" fontFamily="Helvetica Medium"
          sx={{ mb: 1, position: 'absolute', opacity: progressParams ? 0 : 1, transition: 'opacity 100ms' }}
          gutterBottom>
          Loading
        </Typography>
        <Typography variant="h6" fontFamily="Helvetica Medium"
          sx={{ mb: 1, position: 'absolute', opacity: progressParams ? 1 : 0, transition: 'opacity 500ms' }}

          gutterBottom>
          {progressParams?.proggressSoFarCounter} / {progressParams?.totalAmount}
        </Typography>
      </Box>
      <BorderLinearProgress variant="determinate" value={progressParams?.calculatedProggress ?? 0} />
    </Box>
  );
};


export interface InferenceResultsCardProps extends CardProps {
  header: string;
  modelInferenceResult: ModelInferenceResult[] | undefined;
}


function InferenceResultsCard({ header, modelInferenceResult, sx, ...cardProps }: InferenceResultsCardProps) {
  const [page, setPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState<ModelInferenceResult[]>([])
  const [data, setData] = useState<ModelInferenceResult[] | undefined>([])
  const navigate = useNavigate();

  let pageSize = 12;


  useEffect(() => {
    const newPageStartIndex = page * pageSize;
    const newPageEndIndex = newPageStartIndex + pageSize;
    setCurrentPageData(data ? data.slice(newPageStartIndex, newPageEndIndex < data.length ? newPageEndIndex : data.length) : []);
  }, [data, page, pageSize]);

  useEffect(() => {
    setData(modelInferenceResult);
  }, [modelInferenceResult]);

  const handleChangePage = (index: number) => {
    setPage(index);
  }
  const onClickLink = (row: any, link: string) => {
    navigate('/dashboard/url/investigate/url?' + encodeURIComponent(link));
  }
  const csvReport = {
    data: modelInferenceResult || [],
    headers: columns.map((column) => { return { label: column.label, key: column.key } }),
    filename: 'model_inference_result.csv'
  };

  return (
    <Card
      className={!data ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{
        p: 2,
        height: "100%",
        position: 'relative',
        ...sx
      }}
      {...cardProps}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <CSVLink {...csvReport}>

          <IconButton>
            <GetAppIcon />
          </IconButton>
        </CSVLink>

      </Box>
      <Title value={header} sx={{ mb: 2 }} />
      {!data ? (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid xs={12} sx={{
          height: "95%",
        }}>
          <SimpleTable
            onClickLink={onClickLink}
            columns={columns}
            data={currentPageData}
            total={data.length}
            pageSize={pageSize < data.length ? pageSize : data.length}
            page={page}
            onChangePage={handleChangePage}
          />
        </Grid>
      )}
    </Card>
  );
}

export default function ModelInferencePage() {
  const result = useAtomValue(inferenceResultAtom);
  const inferenceLoading = useAtomValue(inferenceLoadingAtom);
  const updateInferenceLoading = useSetAtom(inferenceLoadingAtom);

  const [inferenceData, setInferenceData] = useState<ModelInferenceResult[] | undefined>([])
  const [classifictionCounters, setClassifictionCounters] = useState<Record<string, number> | undefined>({})
  const pieSectors = [
    { name: 'Malicious', label: Classification.MALICIOUS, itemStyle: { color: "#ee6666" } },
    { name: 'Benign', label: Classification.BENIGN, itemStyle: { color: "#91cc75" } },
    { name: 'Not Infrenced Yet', label: Classification.UN_PROCESSED, itemStyle: { color: "#a6a6a6" } },

  ];
  const { value } = useSearch();


  useEffect(() => {
    if (value && result) {
      updateInferenceLoading(true)
      setTimeout(() => {
        updateInferenceLoading(false)
      }, 2000)
    }
  }, [value]);



  // function updateInfrenceDataTimeout() {
  //   return setTimeout(() => {
  //     setInferenceData(currentData => {
  //       if (currentData) {
  //         const index = currentData.findIndex(entry => entry.classification === "Unprocessed");

  //         if (index !== -1) {
  //           const newData = [...currentData];
  //           newData[index].classification = Math.random() < 0.5 ? "Benign" : "Phishing";
  //           return newData;
  //         }

  //         return currentData;
  //       }
  //     });
  //     setClassifictionCounters(countClassifications(inferenceData))
  //   }, 1000);
  // }

  // const getStatus = (str:string)=>{
  //   if(str ===)
  // }
  function updateInfrenceDataTimeout() {
    return setTimeout(() => {
      setInferenceData(currentData => {
        if (currentData) {
          const index = currentData.findIndex(entry => entry.classification === "Unprocessed");

          if (index !== -1) {
            const newData = [...currentData];
            newData[index].classification = stubConfig.modelInferenceDataReal[index].classification;
            return newData;
          }

          return currentData;
        }
      });
      setClassifictionCounters(countClassifications(inferenceData))
    }, 1000);
  }
  const countClassifications = (data: ModelInferenceResult[] | undefined) => {
    return data?.reduce((acc, { classification }) => {
      if (!acc[classification]) {
        acc[classification] = 0;
      }
      acc[classification] += 1;
      return acc;
    }, {} as Record<string, number>);

  };

  useEffect(() => {
    updateInfrenceDataTimeout()
  }, [inferenceData]);
  useEffect(() => {
    setInferenceData(result)
    setClassifictionCounters(countClassifications(result))
  }, [result]);

  return (
    <Box sx={{ m: 5 }}>
      <Stack direction="row" alignItems="baseline">
        <Typography variant="h4">
          Model Inference
        </Typography>

      </Stack>

      <Grid container sx={{ mt: 1, position: 'relative' }} spacing={3}>
        <Grid item xs={12}>
          <InferenceSearchCardModel />
        </Grid>

        {result && !inferenceLoading &&
          <>
            <Grid container xs={12} spacing={3} sx={{ m: 0, mt: 3, position: 'relative', justifyContent: 'center' }}>
              <Grid
                item
                xs={8}
                sx={{ height: "100%" }}
              >
                <ClassificationProgressComponent counters={classifictionCounters} />
              </Grid>
            </Grid>

            <Grid container xs={12} sx={{ m: 0, mt: 3, position: 'relative', justifyContent: 'center', height: { xs: '300px', sm: '400px', md: '400px', lg: '550px', xl: '700px' } }}>

              <Grid
                item
                xs={3}

                sx={{ height: "100%" }}
              >
                <PieChartComponent sectors={pieSectors} counters={classifictionCounters} />
              </Grid>
              <Grid
                item
                xs={5}

                sx={{ height: "100%" }}
              >
                <InferenceResultsCard header="Database Items" modelInferenceResult={inferenceData} />
              </Grid>
            </Grid>
          </>
        }

        {inferenceLoading && (
          <Stack
            sx={{
              position: 'absolute',
              top: 400,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <AtomicSpinner electronPathColor='#b7b7b7' electronPathWidth={0.8} electronSize={2} nucleusSpeed={0.5} />
            <Typography variant="body2" sx={{ mt: 3 }}>Running inference...</Typography>
          </Stack>
        )}

      </Grid>
    </Box>
  );
}