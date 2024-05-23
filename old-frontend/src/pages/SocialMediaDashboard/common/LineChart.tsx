import {format, isToday} from "date-fns";
import {useMemo} from "react";
import {ResponsiveLine} from "@nivo/line";
import {Typography} from "@mui/material";
import {WindowSize} from "../../../common/types.ts";


export interface LineChartProps {
  windowSize: WindowSize;
  data: [string, number][];
}

function getXFormat(d: Date, size: WindowSize) {
  switch (size) {
    case 'day':
      return format(d, 'kk:mm');
    case 'week':
      return isToday(d) ? 'Today' : format(d, 'E');
    default:
      return format(d, 'dd/MM');
  }
}


function getTickValues(data: [string, number][], size: WindowSize) {
  // reverse data so that we always keep the last tick
  // (the first element in the array) as the last tick
  const reversedData = [...data].reverse();

  switch (size) {
    case 'day':
      return reversedData.filter((_, i) => i % 4 === 0).map(([timeStr]) => new Date(timeStr)).reverse();

    case 'month':
      return reversedData.filter((_, i) => i % 5 === 0).map(([timeStr]) => new Date(timeStr)).reverse();

    case 'year':
      return reversedData.filter((_, i) => i % 30 === 0).map(([timeStr]) => new Date(timeStr)).reverse();

    case 'week':
    default:
      return data.map(([timeStr]) => new Date(timeStr));
  }
}

export function LineChart(props: LineChartProps) {
  const data = useMemo(() => [{
    id: 'chart-' + props.windowSize,
    data: props.data.map(([timeStr, amount]) => ({
      x: new Date(timeStr),
      y: amount,
    })),
  }], [props.data, props.windowSize]);

  console.log('tv', getTickValues(props.data, props.windowSize));

  return (
    <>
      <svg style={{height: 0}}>
        <defs>
          <linearGradient id="blueGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="210">
            <stop offset="25%" stopColor="#a0cfff"/>
            <stop offset="100%" stopColor="#a0cfff40"/>
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveLine
        data={data}
        margin={{
          top: 20,
          bottom: 50,
          left: 20,
          right: 20,
        }}
        // colors={{ scheme: 'category10' }}
        colors={['url(#blueGradient)']}
        enablePoints={props.windowSize !== 'year'}
        pointSize={props.windowSize === 'year' ? 1 : 10}
        enableGridX={props.windowSize !== 'year'}
        enableGridY={false}
        isInteractive
        pointColor="white"
        pointBorderColor="#77b3ff"
        pointBorderWidth={2}
        enableArea
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickValues: getTickValues(props.data, props.windowSize),
          tickPadding: 20,
          format: (d) => getXFormat(d, props.windowSize),
        }}
        theme={{
          grid: {
            line: {
              stroke: '#ffffff33',
              // dashed
              strokeDasharray: '1 1',
            }
          },
          axis: {
            ticks: {
              text: {
                fill: 'white',
                fontSize: 12,
                fontFamily: 'Helvetica',
              }
            }
          }
        }}
      />
    </>
  );
}
