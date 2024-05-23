import {useMemo} from "react";
import {ResponsivePie} from "@nivo/pie";
import {Box, Card, Stack, Typography} from "@mui/material";


const PIE_CHART_COLORS = [
  {from: '#70b0ff', to: '#98c6ff'},
  {from: '#6090ff', to: '#12327c'},
  {from: '#a9ffbb', to: '#6fff8d'},
  {from: '#004afe', to: '#80a5ff'},
  {from: '#c5a4ff', to: '#dbc7ff'},
  {from: '#febd42', to: '#efd7ab'},
];


export interface PieChartItem {
  id: string;
  title: string;
  value: number;
}

export interface PieChartProps {
  data: PieChartItem[];
}

export function PieChart(props: PieChartProps) {
  const data = useMemo(() => {
    return props.data.map(item => ({
      id: item.id,
      label: item.title,
      value: item.value,
    }));
}, [props.data])

  return (
    <>
      <svg style={{height: 0}}>
        <defs>
          {PIE_CHART_COLORS.map((color, i) => (
            <linearGradient key={i} id={`pie${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
              <stop offset="0%" stopColor={color.from}/>
              <stop offset="100%" stopColor={color.to}/>
            </linearGradient>
          ))}
        </defs>
      </svg>

      <ResponsivePie
        data={data}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        innerRadius={0.85}
        colors={PIE_CHART_COLORS.map((_, i) => `url(#pie${i})`)}
        margin={{
          bottom: 40,
        }}
        theme={{
          tooltip: {
            container: {
              background: 'white',
              color: 'black',
            }
          }
        }}
        tooltip={point => (
          <Typography>
            {point.datum.label}: {point.datum.value}
          </Typography>
        )}
      />
    </>
  );
}

interface PieChartLegendItemProps {
  title: string;
  value: number;
  colorIndex: number;
}

function PieChartLegendItem(props: PieChartLegendItemProps) {
  const color = PIE_CHART_COLORS[props.colorIndex];

  return (
    <Stack direction="row" alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          background: `linear-gradient(90deg, ${color.from} 0%, ${color.to} 100%)`,
          border: 'solid 1px white',
          borderRadius: '50%',
          mr: 1,
        }}
      />

      <Typography sx={{flex: 1}} variant="body2">
        {props.title}
      </Typography>

      {/*<Typography>*/}
      {/*  {props.value}*/}
      {/*</Typography>*/}
    </Stack>
  );
}


export interface PieChartLegendProps {
  data: PieChartItem[];
}

export function PieChartLegend(props: PieChartLegendProps) {
  return (
    <Stack spacing={2}>
      {props.data.map((item, i) => (
        <PieChartLegendItem
          key={item.id}
          title={item.title}
          value={item.value}
          colorIndex={i % PIE_CHART_COLORS.length}
        />
      ))}
    </Stack>
  );
}
