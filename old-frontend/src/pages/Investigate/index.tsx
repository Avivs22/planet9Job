import './styles.css'
import {
  Alert,
  Box,
  Card,
  CircularProgress, Divider,
  Grid,
  IconButton, MenuItem, Select,
  Stack, SxProps,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  OutlinedInput,
  InputAdornment, List, ListItemButton, ListItemText, Button, Avatar, CardProps, TableContainer, Paper, Pagination, PaginationItem,
} from "@mui/material";
import { Analytics, FileOpen } from "@mui/icons-material";

import { useMutation, useQuery } from "react-query";
import axios from "axios";
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { EXAMPLE_LIME_DATA, LimeSummaryBars, LimeTokenBars, LimeTokenScores } from "../../components/Lime.tsx";

import gorillaImageA from '../../assets/images/gorilla-middle-finger-a.jpg';
import gorillaImageB from '../../assets/images/gorilla-middle-finger-b.jpg';
import expandIcon from '../../assets/icons/expand.svg';
import sortIcon from '../../assets/icons/sort-az.svg';
import { ShowImageDialog } from "../../dialogs/ShowImage.tsx";

import './styles.css';
import {
  autoInvestigateUrlAtom,
  currentUrlAtom,
  longModeAtom,
  longModeLockedAtom,
  selectedModelAtom
} from "../../state/ui.ts";
import { SearchCard, SearchCardRef } from "../../components/SearchCard.tsx";
import { useSnackbar } from "notistack";

import { ModelType } from '../../state/ui.ts';
import { FormValue, FormValues, ViewAnalystDialog } from "../../dialogs/ViewAnalyst.tsx";
import { ViewJsonRawDialog } from '../../dialogs/ViewJsonRaw.tsx';
import ErrorSvg from "../../assets/icons/error.svg"
import { ViewSearchDialog } from '../../dialogs/ViewSearch.tsx';

import * as stubConfig from "../../oriel-consts.ts"
import Title from '../../components/Title.tsx';
import {
  GetIPInfoQueryResponse,
  useDNSQuery,
  usePredictQuery,
  useFaviconQuery,
  useScreenshotQuery,
  useIPInfoQuery,
  useLinksQuery,
  usePredictV2Query,
  retriveModelInferenceDataElement
} from '../../common/api/investigateApi.ts';
import AtomicSpinner from 'atomic-spinner'

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ModelInputCard } from "./ModelInput.tsx";
import { useSearch } from '../../common/SearchContext.tsx';
import { da } from 'date-fns/locale';
import { json } from 'd3';

// TODO make sure to change the input of the new components accurdingly. some of the stubs are inside the

const CLASSES = ['benign', 'phishing'];

// WARNING: DO NOT ENABLE THIS FEATURE
const GORILLA_ENABLED = false;

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
  lime: { explanation: LimeTokenScores } | undefined;
}


const inferenceResultAtom = atom<undefined | null | InferenceResult>(null);
const inferenceLoadingAtom = atom(false);

const basicInfoAtom = atom<null | BasicInfo>(null);


interface PredictMutationParams {
  url: string;
  model: ModelType;
}

interface PredictMutationResponse extends InferenceResult {
}

interface PredictV2Response {
  logits: number[][];
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

interface InferenceSearchCardProps {
  initialUrl: string,
  onUpdateUrl: (url: string) => void
}

function InferenceSearchCard({ initialUrl, onUpdateUrl }: InferenceSearchCardProps) {
  // const predict = usePredictMutation();

  const [predictionUrl, setPredictionUrl] = useState<null | string>(null);
  const predict = usePredictV2Query({
    url: predictionUrl ?? '',
  }, Boolean(predictionUrl));

  const searchRef = useRef<null | SearchCardRef>(null);
  const [modelType, setModelType] = useAtom(selectedModelAtom);
  const [inferenceResult, updateInferenceResult] = useAtom(inferenceResultAtom);
  const updateInferenceLoading = useSetAtom(inferenceLoadingAtom);
  const setLongModeLocked = useSetAtom(longModeLockedAtom);
  const setBasicInfo = useSetAtom(basicInfoAtom);
  const [isShowDialog, setIsShowDialog] = useState(false);

  const setCurrentUrl = useSetAtom(currentUrlAtom);

  useEffect(() => {
    if (initialUrl) {
      searchRef.current?.setValue(initialUrl);
    }
  }, [initialUrl]);

  const handleSearch = () => {
    let url = searchRef.current?.value;
    if (!url)
      return;

    // clear state
    setBasicInfo(null);
    if (inferenceResult === null)
      updateInferenceResult(undefined);

    // updateInferenceLoading(!inferenceLoading);
    url = url.trim();
    // if (!url.startsWith('http://') && !url.startsWith('https://')) {
    //   url = 'http://' + url;
    // }
    searchRef.current?.setValue?.(url);
    setUrl(url)

    setPredictionUrl(url);

    // predict.mutate({ url, model: modelType });
    setLongModeLocked(false);
  }
  // TODO modify to dialog
  const onSearch = () => {
    const url = searchRef.current?.value;
    console.log('os', url);

    if (url) {
      onUpdateUrl(url);
      // openDialog()

      handleSearch();

    }
  };

  useEffect(() => {
    updateInferenceLoading(predict.isLoading);

    if (!predict.isSuccess && predict.isError)
      updateInferenceResult(null);
    else if (predict.isSuccess && !predict.isLoading && predict.data) {
      console.log('got prediction success', predict.data);

      const prediction = predict.data.prediction;
      if (!prediction)
        updateInferenceResult(null)
      else {
        const logits = prediction.logits;
        if (predict.data.url) {
          console.log('setting current url', predict.data.url);
          setCurrentUrl(predict.data.url);
          searchRef.current?.setValue?.(predict.data.url);
        }
        updateInferenceResult({
          url: searchRef.current?.value ?? '',
          url_format: '',
          true_probability: logits[0][1],
          confidence: logits[0][1] > logits[0][0] ? logits[0][1] : logits[0][0],
          is_phishing: logits[0][1] > logits[0][0],
          lime: undefined,
        });
      }
    }
  }, [predict.isLoading, predict.data]);

  const [autoInvestigateUrl, updateAutoInvestigateUrl] = useAtom(autoInvestigateUrlAtom);
  useEffect(() => {
    if (autoInvestigateUrl) {
      const url = autoInvestigateUrl;
      updateAutoInvestigateUrl(null);
      setCurrentUrl(url);

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
  return (
    <Box >
      <SearchCard
        onSearch={onSearch}
        disabled={predict.isLoading}
        placeholder="Enter URL..."
        ref={searchRef}
        leftAction={<ModelSelect value={modelType} onChange={(v) => setModelType(v)} />}
      />

      {isShowDialog &&
        <Grid item xs={12}>

          <ViewSearchDialog
            open={isShowDialog}
            onClose={closetDialog}
            search={handleSearch}
          />
        </Grid>}
    </Box>
  );
}



interface GetBasicInfoParams {
  url: string;
}

interface GetBasicInfoResponse {
  info: BasicInfo;
}

function useGetBasicInfoQuery(params: GetBasicInfoParams, enabled: boolean) {
  const setBasicInfo = useSetAtom(basicInfoAtom);
  return useQuery(['basic-info', params], async () => {
    //return (await axios.get('/api/info', { params })).data as GetBasicInfoResponse;
    return new Promise<string[]>((res, rej) => {
      setTimeout(() => {
        const data = retriveModelInferenceDataElement(params.url)
        const modifiedResultCardData = {
          ip: data?.t0_ipinfo?.ip,
          is_phishing: data?.tagged_label == 'Malicious' ? true : false,
        }
        res({ info: modifiedResultCardData } as any)
      }, 3000)
    })
  }, {
    enabled,
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess(data: any) {
      setBasicInfo(data.info);
    }
  });
}

function ResultsCard() {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useGetBasicInfoQuery(
    { url: url ?? '' },
    !!url
  );

  return (
    <Card sx={{ p: 2, height: '100%', overflow:"auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Typography>Inference Results</Typography>
            <Typography fontWeight="bold" sx={{
              color: data?.info.is_phishing ? '#ff3232' : '#75b3ff',
              fontSize: 42
            }}>{data ? (data?.info.is_phishing ? 'Malicious' : 'Benign') : '?'}</Typography>

            <Typography>{result?.confidence}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" sx={{ width: '100%' }} spacing={2}>
            <Card
              className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
              sx={{
                flex: 1, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              }}
            >
              <Typography>Is in Alexa</Typography>

              {isLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
              {!isLoading && data && (
                <Typography
                  fontWeight="bold"
                  sx={{
                    color: result?.is_phishing ? '#ff3232' : '#75b3ff',
                    fontSize: 42
                  }}
                >
                  {/* {data.info.alexa ? 'Yes' : 'No'} */}
                  N/A
                </Typography>
              )}
              {!data && !isLoading && (
                <Typography fontWeight="bold" sx={{ color: '#bbb', fontSize: 42 }}>
                  N/A
                </Typography>
              )}
            </Card>

            <Card
              className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
              sx={{
                flex: 1, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              }}
            >
              <Typography>IP</Typography>
              {isLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
              {!isLoading && data?.info?.ip && (
                <Typography
                  sx={{
                    color: '#75b3ff',
                    fontSize: data.info.ip.length > 16 ? 11 : 24,
                    mt: data.info.ip.length > 16 ? 3 : 2,
                  }}>
                  {data.info.ip}
                </Typography>
              )}
              {!data && !isLoading && (
                <Typography sx={{ color: '#bbb', fontSize: 28, mt: 1 }}>
                  N/A
                </Typography>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

    </Card>
  )
}


interface ExplainabilityCardProps {
  limeOrientation: 'horizontal' | 'vertical';
}

function ExplainabilityCard(props: ExplainabilityCardProps) {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const [limeData, setLimeData] = useState<any>(undefined);

  const { data, isLoading, error } = usePredictQuery({
    url: url ?? '',
    model: 'balanced'
  }, !!url);

  const probabilityValues = useMemo(() => data ? [1.0 - data.true_probability, data.true_probability] : [0.5, 0.5], [data]);

  useMemo(() => {
    if (data?.lime) {
      setLimeData({
        tokenScores: data.lime.explanation,
      });
    }
    else {
      setLimeData(EXAMPLE_LIME_DATA);
    }
  }, [data]);

  const [longMode, setLongMode] = useAtom(longModeAtom);
  const [longModeLocked] = useAtom(longModeLockedAtom);
  const handleOverflow = useCallback((factor: number) => {
    if (longModeLocked)
      return false;

    if (!longMode && factor > 1.5) {
      setLongMode(true);
      return true;
    }

    if (longMode && factor < 0.5) {
      setLongMode(false);
      return true;
    }

    return false;
  }, [longMode, setLongMode]);

  return (
    <Card
      sx={{ p: 2, height: '100%' }}
    >
      <Stack sx={{ height: '100%' }}>
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{ mb: 1 }}
        >
          Model Explainability
        </Typography>

        <Stack
          direction="row"
          sx={{
            background: 'linear-gradient(#ffffff30, #ffffff10)',
            flex: 1,
            borderRadius: 4,
          }}
        >
          <Stack
            sx={{
              width: props.limeOrientation == 'horizontal' ? 350 : 250,
              borderRight: 'solid 1px #ffffff19',
            }}
          >
            <Typography sx={{ p: 2 }}>
              Prediction probabilities
            </Typography>

            <Stack
              sx={{
                flex: 1,
                // borderBottom: 'solid 1px #ffffff19',
              }}
              alignItems="center"
              justifyContent="center"
            >
              {probabilityValues && (
                <LimeSummaryBars
                  width={200}
                  values={probabilityValues}
                  classes={CLASSES}
                />
              )}
            </Stack>

            {/*<Typography sx={{p: 2, pb: 0}}>*/}
            {/*  Text with highlight words*/}
            {/*</Typography>*/}

            {/*<Typography sx={{p: 2}}>*/}
            {/*  {result?.url_format}*/}
            {/*</Typography>*/}
          </Stack>

          <LimeTokenBars
            data={limeData}
            orientation={props.limeOrientation}
            onOverflow={handleOverflow}
            sx={{
              flex: 1,
              maxHeight: 275,
            }}
          />
        </Stack>
      </Stack>
    </Card>
  )
}

function SearchEngineCard() {
  useEffect(() => {
    const url = "https://cse.google.com/cse.js?cx=473e343c16b924e5a"
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const script = document.querySelector(`script[src='${url}']`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Card sx={{ p: 2, position: 'relative', height: "95%" }}>
      <Title value='Search' />
      <div className="gcse-search"></div>
    </Card>
  );
}

export interface ScreenshotCardProps extends CardProps {
  device: string;
}
function ScreenshotCard({ device }: ScreenshotCardProps) {
  const result = useAtomValue(inferenceResultAtom);
  const [open, setOpen] = useState(false);

  const [error, setError] = useState(false);
  const [errorStage, setErrorStage] = useState(false);

  const [loading, setLoading] = useState(false);
  // const screenshotUrl = error ? null : (result?.url ? '/api/screenshot?url=' + encodeURIComponent(result.url) : null);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useScreenshotQuery({
    url: url ?? '',
    use_db: true,
  });

  const screenshotUrl = data?.info ? new URL(`../../assets/images/modelReferenceStub/${data?.info[device]?.screenshot}`, import.meta.url).href : undefined;
  const handleImageLoaded = () => {
    setLoading(false);
  };
  const handleImageError = (error: any) => {
    setLoading(false);
    setError(true);
    setErrorStage(false);
  };

  useEffect(() => {
    if (result?.url)
      setLoading(true);
    setError(false);
  }, [result?.url]);

  useEffect(() => {
    if (error && !errorStage) {
      setTimeout(() => {
        setErrorStage(true);
      }, 3000);
    }
  }, [error, errorStage]);

  return (
    <Card sx={{ p: 2, position: 'relative', height: "100%" }}>
      {screenshotUrl && (
        <ShowImageDialog
          open={open}
          onClose={() => setOpen(false)}
          imgSrc={screenshotUrl}
        />
      )}

      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
        >
          Screenshot {device}
        </Typography>

        {/*<Typography variant="overline" sx={{ ml: 1 }}>*/}
        {/*  Live*/}
        {/*</Typography>*/}

        <Box sx={{ flex: 1 }} />

        <IconButton onClick={() => setOpen(true)} disabled={!screenshotUrl}>
          <img alt="Expand" src={expandIcon} style={{ width: 16, height: 16 }} />
        </IconButton>
      </Stack>

      {(screenshotUrl || (error && GORILLA_ENABLED)) && (
        <Box sx={{overflow:"auto",height:"80%"}}>
          <img
            src={error ? (GORILLA_ENABLED ? gorillaImageA : null!) : screenshotUrl!}
            onLoad={handleImageLoaded}
            onError={handleImageError}
            style={{
              opacity: error ? 0.15 : 1.0,
              display: loading ? 'undefined' : 'block',
              width: '100%',
              height: 'auto',
              maxHeight: 255,
              objectFit: error ? 'cover' : 'cover',
              objectPosition: error ? '' : 'center top',
              borderRadius: 4,
            }}
          />

          {(error && GORILLA_ENABLED) && (
            <img
              src={gorillaImageB}
              className={errorStage ? 'visible-gorilla' : 'hidden-gorilla'}
              style={{
                transition: 'opacity 2.0s ease-in-out',

                width: 'calc(100% - 32px)',
                height: 'auto',
                maxHeight: 255,
                objectFit: error ? 'cover' : 'contain',
                borderRadius: 4,
                position: 'absolute',
                top: 56,
                left: 16,
              }}
            />
          )}

          {(error && errorStage && GORILLA_ENABLED) && (
            <Typography
              variant="h6"
              sx={{
                position: 'absolute', top: 175, right: 250,
                textShadow: '2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000',
              }}
            >
              Screenshot not found
            </Typography>
          )}
        </Box>
      )}

      {(error && !errorStage && GORILLA_ENABLED) && (
        <CircularProgress
          sx={{ position: 'absolute', top: 175, right: 160 }}
        />
      )}

      {loading && (
        <Alert
          severity="info"
          icon={
            <CircularProgress size={16} sx={{ mt: '2px' }} />
          }
        >
          Loading screenshot...
        </Alert>
      )}

      {!GORILLA_ENABLED && !loading && !screenshotUrl && (
        <Alert severity="info">
          No screenshot available.
        </Alert>
      )}
    </Card>
  )
}



interface GetCertsParams {
  url: string;
}

interface GetCertsResponse {
  certs: any[];
}

interface SSLCert {
  issuer_ca_id: string;
  issuer_name: string;
  common_name: string;
  name_value: string;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  timestamp: string;
}

function useGetCertsQuery(params: GetCertsParams, enabled: boolean) {
  return useQuery(['certs', params], async () => {
    // return (await axios.get('/api/certs', { params })).data as GetCertsResponse;
    //return (await axios.get('/api/athena/cert', { params: {...params, use_db: true} })).data as GetCertsResponse;
    return new Promise<string[]>((res, rej) => {
      setTimeout(() => {
        const data = retriveModelInferenceDataElement(params.url)
        if (data && data.t0_certsh) {
          // const modifiedData = {} as any
          // modifiedData["common_name"] = JSON.parse(data.cert.find(([key]) => key === 'subject')[1])[0][0][1]

          res({ info: [data?.t0_certsh][0] } as any)
        } else {
          res([])
        }
      }, 3000)
    })
  }, {
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

const NESTED_CERT_FIELDS = [
  { key: 'subject', name: 'Subject', check: 'subject' },
  { key: 'issuer', name: 'Issuer', check: 'issuer' },
]

const ALL_CERT_FIELDS = [
  ...NESTED_CERT_FIELDS,
  { key: 'validity', name: 'Validity', check: 'notBefore' },
  { key: 'subjectAltName', name: 'Subject Alt Names', check: 'subjectAltName' },
]

interface CertificatePartTableProps {
  items: [string, string][];
}

function CertificatePartTable(props: CertificatePartTableProps) {
  return (
    <Stack
      spacing={1}
      sx={{
        p: 1,
        px: 2,
        backgroundColor: '#ffffff30',
        borderRadius: 3,
      }}
    >
      {props.items.map((row, i) => (
        <Fragment key={i}>
          <Stack direction="row">
            <Typography
              variant="body2"
              sx={{
                textAlign: 'left', color: 'white', width: 166,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              <b>{row[0]}</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {row[1]}
            </Typography>
          </Stack>

          {i !== props.items.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Stack>
  );
}


interface CertificatePartProps extends CertificatePartTableProps {
  hideName?: boolean;
  name: string;
  sx?: SxProps;
}

function CertificatePart(props: CertificatePartProps) {

  return (
    <Box
      sx={{
        ...props.sx
      }}
    >
      {!props.hideName && (
        <Typography variant="overline">
          {props.name}
        </Typography>
      )}

      {/*<Divider />*/}

      <CertificatePartTable
        items={props.items}
      />
    </Box>
  )
}

interface CertificateNestedPartProps {
  hideName?: boolean;
  name: string;
  data: any;
  sx?: SxProps;
}

function CertificateNestedPart(props: CertificateNestedPartProps) {
  const items = useMemo(() => {
    const result = [];
    for (const topLayer of props.data) {
      for (const field of topLayer) {
        result.push(field);
      }
    }

    return result;
  }, [props.data]);

  return (
    <CertificatePart
      hideName={props.hideName}
      name={props.name}
      items={items}
      sx={props.sx}
    />
  )
}


function DNSCard({ sx, ...cardProps }: CardProps) {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useDNSQuery({
    url: url ?? '',
  }, !!url);

  const [selectedField, setSelectedField] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSelectedField(data ? Object.keys(data)[0] : undefined)
  }, [data])


  return (
    <Card
      className={!data ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{ p: 2, height: "100%", ...sx }}
      {...cardProps}
    >
      <Title value='DNS' sx={{ mb: 2 }} />
      <Grid direction="row"
        container
        xs={12}
        sx={{
          overflow: "auto",
          height: "85%",
        }}>
        {data ?
          <>
            <Grid item xs={3}>

              <List
                sx={{
                  borderRight: 'solid 1px #ffffff19',
                  pr: 2,
                  mr: 2,
                  overflow: "auto"
                }}>
                {Object.keys(data).map((key) => (
                  <ListItemButton
                    sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                    key={key}
                    selected={key === selectedField}
                    onClick={() => setSelectedField(key)}
                  >
                    <ListItemText>{key}</ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Grid>
            <Grid item xs={9}>

              <Table >
                <TableBody>
                  {selectedField && data[selectedField] && Object.entries(data[selectedField].data).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell ><b>{key}</b></TableCell>
                      <TableCell >{value ? JSON.stringify(value) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </Grid>
          </> : <Box sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <CircularProgress />
          </Box>}
      </Grid>
    </Card >
  );
}

function SSLCertificateCard() {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading, error } = useGetCertsQuery({
    url: url ?? '',
  }, !!url);

  const cert = (data?.certs && data.certs.length > 0) ? data?.certs[0] : null;
  const relevantCertFields = useMemo(() => {
    if (!cert) return [];
    return NESTED_CERT_FIELDS.filter(field => cert.hasOwnProperty(field.key));
  }, [cert]);

  const altNames = useMemo(() => {
    let result = cert?.['subjectAltName'];
    if (!result) return [];
    if (result.length > 5) {
      result = [...result.slice(0, 5), ['', `and ${result.length - 5} more...`]];
    }
    return result;
  }, [cert]);

  const [selectedField, setSelectedField] = useState('subject');

  return (
    <Card
      className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{ p: 2 }}
    >
      <Typography
        variant="h6"
        fontFamily="Helvetica Medium"
      >
        SSL Certificate
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Could not load or verify SSL certificate.
        </Alert>
      )}

      {cert && (
        <Stack direction="row">
          <List
            sx={{
              minWidth: 180,
              borderRight: 'solid 1px #ffffff19',
              pr: 2,
              mr: 2,
            }}>
            {ALL_CERT_FIELDS.filter(field => cert && cert.hasOwnProperty(field.check)).map((field) => (
              <ListItemButton
                key={field.key}
                selected={field.key === selectedField}
                onClick={() => setSelectedField(field.key)}
              >
                <ListItemText>{field.name}</ListItemText>
              </ListItemButton>
            ))}
          </List>

          {cert && (
            <>
              {relevantCertFields.filter(field => field.key === selectedField).map((field) => (
                <CertificateNestedPart
                  hideName={true}
                  key={field.key}
                  name={field.name}
                  data={cert[field.key]}
                  sx={{ flex: 1, mt: 1 }}
                />
              ))}

              {selectedField === 'subjectAltName' && (
                <CertificatePart
                  hideName={true}
                  name="Subject Alt Names"
                  items={altNames}
                  sx={{ flex: 1, mt: 1 }}
                />
              )}

              {selectedField === 'validity' && (
                <CertificatePart
                  hideName={true}
                  name="Validity"
                  items={[
                    ['Not Before', cert['notBefore']],
                    ['Not After', cert['notAfter']],
                  ]}
                  sx={{ flex: 1, mt: 1 }}
                />
              )}
            </>
          )}
        </Stack>
      )}
    </Card>
  );
}


// function CompanyRegistryCard() {
//   return (
//     <Card sx={{p: 2}}>
//       <Typography
//         variant="h6"
//         fontFamily="Helvetica Medium"
//       >
//         Company Registry
//       </Typography>
//     </Card>
//   );
// }


interface GetExternalLinksParams {
  url: string;
}

interface GetExternalLinksResponse {
  links: {
    [name: string]: string;
  }
}

function useGetExternalLinksQuery(params: GetExternalLinksParams, enabled: boolean) {
  return useQuery(['external-links', params], async () => {
    return (await axios.get('/api/external_links', { params })).data as GetExternalLinksResponse;
  }, {
    enabled,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

function ExternalLinksCard() {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useGetExternalLinksQuery({
    url: url ?? '',
  }, !!url);

  return (
    <Card
      className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{ p: 2 }}
    >
      <Typography
        variant="h6"
        fontFamily="Helvetica Medium"
        sx={{ mb: 2 }}
      >
        External Links
      </Typography>

      <Stack alignItems="center" spacing={1}>
        {data?.links && Object.entries(data?.links).map((link, i) => (
          <Typography
            component="a"
            key={i}
            color="#ccc"
            sx={{ textDecoration: 'underline' }}
            href={link[1]}
            target="_blank"
          >
            Link to {link[0]}
          </Typography>
        ))}
      </Stack>
    </Card>
  );
}


interface GetWhoisParams {
  url: string;
}

interface GetWhoisResponse {
  whois: {
    domain: string;
    registrar: null | string;
    registrant_country: null | string;
    creation_date: null | string;
    expiration_date: null | string;
    last_updated: null | string;
  }
}

interface GetWhoisQueryResponse {
  scan_uuid: string;
  timestamp: string;
  elapsed_time_seconds: number;
  errors: string[];
  domain: string;
  url: string;
  result: string;
  year: number;
  month: number;
  day: number;
}

function useGetWhoisQuery(params: GetWhoisParams, enabled: boolean) {
  return useQuery(['whois', params], async () => {
    // return (await axios.get('/api/whois', { params })).data as GetWhoisResponse;
    // return (await axios.get('/api/athena/full-whois', { params })).data as GetWhoisQueryResponse[];
    //return (await axios.get('/api/athena/whois', { params })).data as GetWhoisQueryResponse[];



    return new Promise<string[]>((res, rej) => {
      setTimeout(() => {
        const data = retriveModelInferenceDataElement(params.url)
        res({ info: [data?.t0_whois] } as any)
        // } else {
        //   res([])
        // }
      }, 3000)
    })

  }, {
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

interface WhoIsInfo {
  scan_uuid: string;
  timestamp: string;
  elapsed_time_seconds: string;
  errors: string;
  domain: string;
  name: string;
  ltd: string;
  registrar: string;
  registrar_country: string;
  creation_date: string;
  expiration_date: string;
  last_updated: string;
  status: string;
  statuses: string;
  dnssec: string;
  name_servers: string;
  registrant: string;
  emails: string;
}

const WHOIS_COLUMNS = [
  { key: "scan_uuid", name: "Scan UUID" },
  { key: "timestamp", name: "Timestamp" },
  { key: "elapsed_time_seconds", name: "Elapsed Time (seconds)" },
  { key: "errors", name: "Errors" },
  { key: "domain", name: "Queried Domain" },
  { key: "name", name: "Name" },
  { key: "ltd", name: "LTD" },
  { key: "registrar", name: "Registrar" },
  { key: "registrar_country", name: "Registrar Country" },
  { key: "creation_date", name: "Creation Date" },
  { key: "expiration_date", name: "Expiration Date" },
  { key: "last_updated", name: "Last Updated" },
  { key: "status", name: "Status" },
  { key: "statuses", name: "Statuses" },
  { key: "dnssec", name: "DNS sec" },
  { key: "name_servers", name: "Name Servers" },
  { key: "registrant", name: "Registrant" },
  { key: "emails", name: "Emails" },
]

function WhoisCard() {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useGetWhoisQuery({
    url: url ?? '',
    use_db: true,
  }, !!url);

  return (
    <Card
      className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{
        p: 2, height: '100%'
      }}
    >
      <Typography
        variant="h6"
        fontFamily="Helvetica Medium"
        sx={{ mb: 2 }}
      >
        WHOIS
      </Typography>
      <Box sx={{
        overflow: 'auto',
        height: '85%'
      }}>
        <Table
          size="small"
          sx={{
            backgroundColor: '#ffffff30',
            borderRadius: 3,
          }}>
          <colgroup>
            <col style={{ width: '40%' }} />
          </colgroup>

          <TableBody>
            {WHOIS_COLUMNS.map((column) => (
              <TableRow key={column.key}>
                <TableCell
                  sx={{
                    textAlign: 'left',
                    color: 'white',
                    width: 100,
                  }}
                >
                  <b>{column.name}</b>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {isLoading && <CircularProgress size={16} />}
                  {/* {!isLoading && data?.whois && (data?.whois?.[column.key] ?? 'N/A')} */}
                  {!isLoading && data?.info && (data?.info[0][column.key] ?? 'N/A')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

interface SSLCert {
  issuer_ca_id: string;
  issuer_name: string;
  common_name: string;
  name_value: string;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  timestamp: string;
}
const SSL_CERT_COLUMNS: Array<{ key: string; name: string }> = [
  { key: 'issuer_ca_id', name: 'Issuer CA ID' },
  { key: 'issuer_name', name: 'Issuer Name' },
  { key: 'common_name', name: 'Common Name' },
  { key: 'name_value', name: 'Name Value' },
  { key: 'entry_timestamp', name: 'Entry Timestamp' },
  { key: 'not_before', name: 'Not Before' },
  { key: 'not_after', name: 'Not After' },
  { key: 'serial_number', name: 'Serial Number' },
  { key: 'timestamp', name: 'Timestamp' },
]

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
}
const IP_INFO_COLUMNS: Array<{ key: keyof GetIPInfoQueryResponse; name: string }> = [
  // const COLUMNS: Array<{ key: keyof IPInfo; name: string }> = [
  // { key: 'ip', name: 'IP' },
  // { key: 'city', name: 'City' },
  // { key: 'region', name: 'Region' },
  // { key: 'country', name: 'Country' },
  // { key: 'loc', name: 'Geo Location' },
  // { key: 'org', name: 'ORG' },
  // { key: 'postal', name: 'Postal' },
  // { key: 'timezone', name: 'Timezone' },
  // { key: 'readme', name: 'README' },
  { key: 'ip', name: 'IP' },
  { key: 'is_proxy', name: 'Is Proxy' },
  { key: 'city', name: 'City' },
  { key: 'region', name: 'Region' },
  { key: 'country', name: 'Country' },
  { key: 'loc', name: 'Geo Location' },
  { key: 'org', name: 'ORG' },
  { key: 'postal', name: 'Postal' },
  // { key: 'timezone', name: 'Timezone' },
  { key: 'readme', name: 'README' },
  { key: 'timestamp', name: 'Timestamp' },
]

interface InfoCardColumn<T> {
  key: keyof T;
  name: string;
}
export interface InfoCardProps<T> extends CardProps {
  header: string;
  extractorQuery: any;
  columns: InfoCardColumn<T>[] | Array;
}
// TODO change WHOIS to use this
function InfoCard<T>({ header, columns, extractorQuery, sx, ...cardProps }: InfoCardProps<T>) {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');


  const { data, isLoading } = extractorQuery({
    url: url ?? '',
    use_db: true,
  }, !!url);

  const isError = data === undefined;

  const renderTable = (data, columns) => (
    <Table size="small">
      <TableBody>
        {columns.map((column: InfoCardColumn<T>) => (
          <TableRow key={String(column.key)}>
            <TableCell
              sx={{
                width: 10,
              }}
            >
              <b>{column.name}</b>
            </TableCell>
            <TableCell>
              {
                data?.info?.[0]?.[column.key] ? String(data?.info?.[0]?.[column.key]) : 'N/A'
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );


  return (
    <Card
      className={!data ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{
        p: 2,
        height: "100%",
        ...sx
      }}
      {...cardProps}
    >
      <Title value={header} sx={{ mb: 2 }} />

      <Grid container xs={12} sx={{
        overflow: 'auto', height: "85%",


      }}>
        {data ? (data?.info?.length > 0 ?
          <>
            {renderTable(data, columns)}
          </>
          : <Title value='N/A' variant='h6' />)
          : <Box sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <CircularProgress />
          </Box>}
      </Grid>
    </Card>
  );
}


function FaviconCard() {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useFaviconQuery({
    url: url ?? '',
  });

  const renderFavicon = (data: any) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      <Title value={data.info.icon_url} variant='h6' />
      <Avatar
        src={data.info.favicon}
        alt={ErrorSvg}
        sx={{
          width: 56,
          height: 56,
          marginTop: 1,
          borderRadius: '50%',
        }}
      />  </Box>
  );

  return (
    <Card
      className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{
        p: 2,
        overflow: 'auto',
        height: "95%"
      }}
    >
      {data ? (typeof data !== 'string' ?
        renderFavicon(data) :
        <Title value={data} variant='h6' />
      )
        : <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: "5%",
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress />
        </Box>
      }
    </Card>
  );
}

export interface ListCardProps extends CardProps {
  header: string;
}
// TODO move the use query to the props and create useQuery for each list
function ListCard({ header, sx, ...cardProps }: ListCardProps) {
  const result = useAtomValue(inferenceResultAtom);

  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { data, isLoading } = useLinksQuery({
    url: url ?? '', type: header,
    use_db: true,
  }, !!url);

  const isArray = Array.isArray(data);

  const renderRow = (item, index) => (
    <TableRow key={index}>
      <TableCell align="center">
        <a href={isArray ? item : item.value} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          {isArray ? item : `${item.key}`}
        </a>
      </TableCell>
    </TableRow>
  );

  return (
    <Card
      className={!data ? 'loading-base loading-small-blur' : 'loading-base'}
      sx={{
        p: 2,
        height: "100%",
        ...sx
      }}
      {...cardProps}
    >
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
          overflow: 'auto',
          height: "80%",
        }}>
          <Table
            size="small"
          >
            <TableBody >
              {isArray ? (
                data.map((item, index) => renderRow(item, index))
              ) : (
                Object.entries(data).map(([key, value], index) => renderRow({ key, value }, index))
              ) || <TableRow><TableCell>N/A</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Grid>
      )}
    </Card>
  );
}


interface SaveResultMutationParams {
  url: string;
  is_malicious: boolean;
  score: number;
  ip: null | string;
}

interface SaveResultMutationResponse { }

function useSaveResultMutation() {
  return useMutation({
    mutationFn: async (params: SaveResultMutationParams) =>
      (await axios.post('/api/save', params)).data as SaveResultMutationResponse,
  })
}

function SaveButton() {
  const infResult = useAtomValue(inferenceResultAtom);
  const basicInfo = useAtomValue(basicInfoAtom);

  const { enqueueSnackbar } = useSnackbar();

  const saveResult = useSaveResultMutation();
  const disabled = saveResult.isLoading || !infResult || !basicInfo;


  const handleSave = () => {
    if (disabled || !infResult || !basicInfo)
      return;

    saveResult.mutate({
      url: infResult.url,
      is_malicious: infResult.is_phishing,
      score: infResult.true_probability,
      ip: basicInfo?.ip ?? null,
    }, {
      onSuccess() {
        enqueueSnackbar('Result successfully saved.', {
          variant: 'success',
          autoHideDuration: 1000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    });
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          textDecoration: 'underline',
          mr: 2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'undefined'
        }}
        color={disabled ? '#aaa' : '#fff'}
        onClick={handleSave}
      >
        {saveResult.isLoading ? 'Saving...' : 'Save'}
      </Typography>

      {saveResult.isLoading && <CircularProgress size={16} sx={{ mr: 3 }} />}
    </>
  );
}

export default function InvestigatePage() {
  const { value } = useSearch();
  const result = useAtomValue(inferenceResultAtom);
  const inferenceLoading = useAtomValue(inferenceLoadingAtom);
  const longMode = useAtomValue(longModeAtom);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isShowRawJsonDialog, setIsShowRawJsonDialog] = useState(false);
  const {globalUrls } = useSearch();

  const [searchParams, setSearchParams] = useSearchParams();
  let url = searchParams.get('url') ?? '';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
    setSearchParams({ url: url });
  }

  const navigate = useNavigate();
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const urlParam = url || '';


  const [currentUrl, setCurrentUrl] = useAtom(currentUrlAtom);
  useEffect(() => {
    // if (currentUrl === undefined && url)
    //   setCurrentUrl(url);
  }, [url]);

  const updateUrlParam = (newUrl: string) => {
    setCurrentUrl(newUrl);
    navigate(`${location.pathname}?url=${encodeURIComponent(newUrl)}`, { replace: true });
  };



  const onAnalystReportSubmit = async (data: any) => {

    return new Promise<void>((res, rej) => {
      setTimeout(() => { res() }, 1000)
    })
  }
  const closeAnalystDialog = () => {
    setIsShowDialog(false)
  }
  const openAnalystDialog = () => {
    setIsShowDialog(true)
  }

  const closeRawJsonDialog = () => {
    setIsShowRawJsonDialog(false)
  }
  const openRawJsonDialog = () => {
    setIsShowRawJsonDialog(true)
  }

  const handleChangePage = (index: number) => {

    updateUrlParam(globalUrls?.[index]?? "")
  }
  const getCurrentPage = ()=>{
    return globalUrls?.findIndex(x=>x==url) ?? 1
  }
  

  return (
    <Box sx={{ m: 5 }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between">
        <Typography variant="h4">
          Investigate
        </Typography>
        <Box sx={{ position:'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>

          <Pagination
            disabled={!globalUrls}
            count={globalUrls?.length ?? 5}
            size='large'
            page={getCurrentPage()+1}
            defaultPage={1}
            variant="text"
            onChange={(_, v) => v && handleChangePage?.(v - 1)}
            renderItem={(item) => (
              <PaginationItem {...item} />
            )}
          />
          </Box>
        <SaveButton />
      </Stack>


      <Grid container sx={{ mt: 1, position: 'relative' }} spacing={3}>
        <Grid item xs={12}>
          <InferenceSearchCard initialUrl={urlParam} onUpdateUrl={updateUrlParam} />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

            {/*<Button*/}
            {/*  variant="contained"*/}
            {/*  className='theme-button'*/}
            {/*  endIcon={<FileOpen />}*/}
            {/*  disabled={!result}*/}
            {/*  onClick={openRawJsonDialog}*/}
            {/*>*/}
            {/*  Raw Json*/}
            {/*</Button>*/}
            <Button
              variant="contained"
              className='theme-button'
              endIcon={<Analytics />}
              onClick={openAnalystDialog}
            >
              Analyze
            </Button>
          </Box>
        </Grid>
        {isShowDialog &&
          <Grid item xs={12}>
            <ViewAnalystDialog
              open={true}
              onClose={closeAnalystDialog}
              onSubmit={onAnalystReportSubmit}
              formValues={stubConfig.formValues}
            />
          </Grid>}

        {isShowRawJsonDialog &&
          <Grid item xs={12}>
            <ViewJsonRawDialog
              open={true}
              onClose={closeRawJsonDialog}
            />
          </Grid>}

        {/* {Boolean(currentUrl) && result === null && (
          <Grid item xs={12}>
            <Alert severity="error">
              Inference error, please try a different URL or try again later.
            </Alert>
          </Grid>
        )}

        {currentUrl === undefined || !value && (
          <Grid item xs={12}>
            <Alert severity="info">
              Please enter a URL.
            </Alert>
          </Grid>
        )} */}

        {(result || value) && url.length>7 && (
          <>
            <Grid container xs={12} sx={{ m: 0, mt: 1, position: 'relative', height: { xs: '150px', sm: '150px', md: '200px', lg: '250px', xl: '350px' } }} spacing={3}>

              <Grid
                item
                xs={4}
                sx={{ height: '100%' }}

              >

                    <ResultsCard  />

              </Grid>

              {/*<Grid*/}
              {/*  item*/}
              {/*  xs={12}*/}
              {/*  lg={6}*/}
              {/*  xl={longMode ? 8 : 4}*/}
              {/*  className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}*/}
              {/*>*/}
              {/*  <ExplainabilityCard*/}
              {/*    limeOrientation={longMode ? 'horizontal' : 'vertical'}*/}
              {/*  />*/}
              {/*</Grid>*/}

              <Grid
                item
                xs={4}
                sx={{ height: '100%' }}

                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
              >
                <ScreenshotCard device='desktop' />
              </Grid>

              <Grid
                item
                xs={4}
                sx={{ height: '100%' }}

                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
              >
                <ScreenshotCard device='android' />
              </Grid>
            </Grid>

            <Grid container xs={12} sx={{ m: 0, mt: 4, position: 'relative', height: { xs: '150px', sm: '150px', md: '200px', lg: '250px', xl: '350px' } }} spacing={3} >
              <Grid
                item
                xs={4}
                lg={4}
                xl={4}
                sx={{
                  height: '100%',
                }}
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
              >
                <InfoCard<IPInfo> header='IP Info' extractorQuery={useIPInfoQuery} columns={IP_INFO_COLUMNS} />
              </Grid>

              <Grid
                item
                xs={2}
    
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                sx={{ height: "100%" }}
              >
                <ListCard header="Additional Analysis" />
              </Grid>

              <Grid
                item
                xs={2}
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                sx={{ height: "100%" }}
              >
                <ListCard header="Outer Links" />
              </Grid>

              <Grid
                item
                xs={4}
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                sx={{ height: "100%" }}

              >
                <ScreenshotCard device='iphone' />
              </Grid>
            </Grid>
            <Grid container xs={12} sx={{ m: 0, mt: 4, position: 'relative', height: { xs: '200px', sm: '200px', md: '300px', lg: '350px', xl: '500px' } }} spacing={3} >

              <Grid
                item
                xs={6}
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                sx={{ height: '100%' }}
              >
                {/* <SSLCertificateCard /> */}
                <InfoCard<SSLCert> header='SSL Certificate' extractorQuery={useGetCertsQuery} columns={SSL_CERT_COLUMNS} />
              </Grid>

              {/* <Grid
              item
              xs={12}
              md={6}
              lg={3}
              xl={2}
              className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
            >
              <ExternalLinksCard />
            </Grid> */}

              <Grid
                item
                xs={6}
                className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                sx={{ height: '100%' }}
              >
                <WhoisCard />
              </Grid>
            </Grid>


            {/*<Grid*/}
            {/*  item*/}
            {/*  xs={12}*/}
            {/*  md={6}*/}
            {/*  lg={3}*/}
            {/*  xl={2}*/}
            {/*  className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}*/}
            {/*>*/}
            {/*  <CompanyRegistryCard/>*/}
            {/*</Grid>*/}

            <Grid container xs={12} sx={{ m: 0, mt: 4, position: 'relative', height: { xs: '150px', sm: '150px', md: '200px', lg: '250px', xl: '350px' } }} spacing={3}>
              <Grid container xs={4} sx={{ m: 0, position: 'relative', height: "100%" }} spacing={3}>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  xl={12}
                  sx={{ height: "50%" }}
                  className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}
                >
                  <SearchEngineCard />
                </Grid>

                {/*<Grid*/}
                {/*  item*/}
                {/*  xs={12}*/}
                {/*  lg={12}*/}
                {/*  xl={12}*/}
                {/*  sx={{ height: "50%", mt: 1 }}*/}
                {/*  className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}*/}
                {/*>*/}
                {/*  <FaviconCard />*/}
                {/*</Grid>*/}
              </Grid>

              {/*<Grid*/}
              {/*  item*/}
              {/*  xs={4}*/}
              {/*  lg={4}*/}
              {/*  xl={4}*/}
              {/*  className={inferenceLoading ? 'loading-base loading-blur' : 'loading-base'}*/}
              {/*  sx={{*/}
              {/*    height: '100%',*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <DNSCard />*/}
              {/*</Grid>*/}

              {/*<Grid item xs={4} sx={{ mt: 3, mb: 3 }}>*/}
              {/*  <ModelInputCard />*/}
              {/*</Grid>*/}
            </Grid>
          </>
        )}
      </Grid>

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
    </Box>
  );
}