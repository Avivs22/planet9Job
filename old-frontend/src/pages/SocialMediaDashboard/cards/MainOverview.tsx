import {getStatColor, NiceSelect, StatProps, WordCloudItem} from "../common/common.ts";
import {Box, Card, CircularProgress, Divider, Grid, Stack, SxProps, Typography, useMediaQuery} from "@mui/material";
import {EXAMPLE_LINE_DATA, EXAMPLE_PIE_DATA} from "../common/example.ts";
import {PieChart, PieChartLegend} from "../common/PieChart.tsx";
import {LineChart} from "../common/LineChart.tsx";
import {SelectTimeWindow} from "../common/SelectTimeWindow.tsx";
import {WindowSize} from "../../../common/types.ts";
import {useMemo, useState} from "react";
import {GetSDBStatsResponse, useGetSDBStatsQuery, useGetWordcloudQuery} from "../../../common/api.ts";
import {getDoubleTimeRangeInSeconds} from "../../../common/utils.ts";
import { WordCloud } from "./WordCloud.tsx";


function Stat(props: StatProps) {
  const color = getStatColor(props.color || 'white');

  return (
    <Box>
      <Typography
        sx={{color: '#ffffffb2'}}
        fontFamily="Helvetica"
        variant="body2"
      >
        {props.title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color,
          maxWidth: 200,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {props.value}
      </Typography>
    </Box>
  );
}


interface TopCasesBodyProps {
  data?: GetSDBStatsResponse;
  windowSize: WindowSize;
}

function TopCasesBody(props: TopCasesBodyProps) {
  const showLegend = useMediaQuery('(min-width:1810px)');

  const pieData = useMemo(() => {
    if (!props.data?.top_cases)
      return null;

    return props.data.top_cases.map(([name, value], i) => ({
      id: `item${i}`,
      title: name,
      value,
    }));
  }, [props.data]);

  return (
    <Grid container sx={{flex: 1}} alignItems="center">
      <Grid item xs="auto" sx={{alignSelf: 'flex-start'}}>
        <Stack direction="row" sx={{flex: 1}}>
          <Stack spacing={2}>
            <Stat title="Total cases" value={props.data?.num_total_cases ?? '?'} color="white"/>
            <Divider sx={{borderColor: '#95a6b819'}}/>
            <Stat title={`New cases this ${props.windowSize}`} value={props.data?.num_cases ?? '?'} color="white"/>
            <Divider sx={{borderColor: '#95a6b819'}}/>
            <Stat
              title="Most mentioned cases"
              value={(props.data?.top_cases && props.data.top_cases.length > 0 ? props.data.top_cases[0][0] : null) ?? '?'} color="white"
            />
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Box sx={{height: 225, width: 225, position: 'relative'}}>
            <Box sx={{position: 'absolute', inset: 0}}>
              {pieData && <PieChart data={pieData}/>}
            </Box>

            {/*<Box sx={{pointerEvents: 'none', position: 'absolute', top: '37%', left: '32%'}}>*/}
            {/*  <Typography fontSize={20} fontWeight="bold" textAlign="center">Payments<br/>variation</Typography>*/}
            {/*</Box>*/}
          </Box>
        </Stack>
      </Grid>

      {showLegend && pieData && (
        <Grid item xs="auto">
          <Stack sx={{flex: 1, ml: 5, minWidth: 250}} justifyContent="center">
            <PieChartLegend data={pieData}/>
          </Stack>
        </Grid>
      )}
    </Grid>
  )
}


interface WordCloudBodyProps {
  caseId: string,
  windowStart: number,
  windowEnd: number,
}

function WordCloudBody(props: WordCloudBodyProps) {
  const { data, isLoading } = useGetWordcloudQuery({
    case_uuid: props.caseId,
    window_start: props.windowStart,
    window_end: props.windowEnd,
  })

  const words = useMemo<null | WordCloudItem[]>(() => {
    if (!data)
      return null;

    return Object.entries(data.words).map(([word, count]) => {
      return {
        word,
        count,
      };
    });
  }, [data]);

  return (
    <Box sx={{ height: 265, position: 'relative', my: 2 }}>
      <Box sx={{ position: 'absolute', inset: 0 }}>
        {words && (
          <WordCloud
            data={words}
            sx={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </Box>
    </Box>
  )
}


export interface MainOverviewCardProps {
  sx?: SxProps;
  hideStats?: boolean;
  caseId?: string;
}

export function MainOverviewCard(props: MainOverviewCardProps) {
  const [windowSize, setWindowSize] = useState<WindowSize>('week');

  const doubleWindow = useMemo(() => getDoubleTimeRangeInSeconds(windowSize), [windowSize]);
  console.log('doubleWindow', doubleWindow);
  const { data, isLoading } = useGetSDBStatsQuery({
    window_pre_start: doubleWindow[0],
    window_start: doubleWindow[1],
    window_end: doubleWindow[2],
    window_size: windowSize,
    case_uuid: props.caseId,
  });

  // const {data} = useSalesStatsQuery({window_size: windowSize});
  // const data = null;

  return (
    <Card
      sx={{
        transition: 'filter 0.25s ease',
        filter: isLoading ? 'blur(5px)' : 'none',
        ...props.sx
      }}
    >
      {/*<CardHeader title="Sales"/>*/}

      <Grid container spacing={3} sx={{pt: 1, position: 'relative'}}>
        <Grid item xs={props.hideStats ? 12 : 6} sx={{p: 2}}>
          <Stack direction="row" alignItems="baseline">
            <Typography variant="h5" sx={{ml: 3, mb: -1}}>
              {props.caseId ? "General info" : "Items"}
            </Typography>

            <Box sx={{flex: 1}}/>

            <SelectTimeWindow
              value={windowSize}
              onChange={(value) => setWindowSize(value)}
            />
          </Stack>

          {/* horizontal border */}
          <Box
            sx={{
              position: 'absolute',
              bgcolor: '#ffffff18',
              width: '100%',
              height: '1px !important',
              mt: 1,
            }}
          />

          <Box
            sx={{
              // bgcolor: 'green',
              mt: 1,
              p: 3,
              px: 4,
            }}
          >
            <Stack direction="row" sx={{flex: 1}} spacing={7}>
              <Stack spacing={2}>
                <Stat title={`Total items this ${windowSize}`} value={data?.num_posts ?? '?'} color="blue"/>
                <Divider sx={{borderColor: '#95a6b819'}}/>
                <Stat title={`Change from last ${windowSize}`} value={data?.num_posts_change ?? '?'} color="green"/>
                <Divider sx={{borderColor: '#95a6b819'}}/>
                <Stat title={`Most items per ${windowSize === 'day' ? 'hour' : 'day'}`} value={data?.most_per_tick ?? '?'} color="white"/>
              </Stack>

              <Box sx={{flex: 1, position: 'relative'}}>
                <Box sx={{position: 'absolute', inset: 0, right: -20}}>
                  {data?.line_chart && <LineChart windowSize={windowSize} data={data.line_chart}/>}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {!props.hideStats && (
          <>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="baseline">
                <Typography variant="h5" sx={{mb: -1}}>
                  {props.caseId ? "Word cloud" : "Top cases"}
                </Typography>

                {/* here only to make height the same */}
                <NiceSelect
                  variant="standard"
                  sx={{visibility: 'hidden'}}
                >
                </NiceSelect>
              </Stack>

              <Box
                sx={{
                  // bgcolor: 'red',
                  mt: 1,
                  p: 3,
                  px: 2,

                  // add vertical border with after
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 75,
                    bottom: 0,
                    transform: 'translate(-36px, 0)',
                    width: '1px !important',
                    bgcolor: '#ffffff18',
                  }
                }}
              >
                {props.caseId ? (
                  <WordCloudBody caseId={props.caseId} windowStart={doubleWindow[1]} windowEnd={doubleWindow[2]} />
                ) : (
                  <TopCasesBody data={data} windowSize={windowSize} />
                )}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
}
