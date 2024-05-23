import {Box, Card, Stack, SxProps, Typography} from "@mui/material";
import {WordCloudItem} from "../common/common.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import d3cloud from "d3-cloud";
import {EXAMPLE_WORD_CLOUD_DATA} from "../common/example.ts";
import useResizeObserver from "@react-hook/resize-observer";
import {SelectTimeWindow} from "../common/SelectTimeWindow.tsx";
import {WindowSize} from "../../../common/types.ts";
import {useGetWordcloudQuery} from "../../../common/api.ts";
import {getTimeRangeInSeconds} from "../../../common/utils.ts";


const MARGINS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};


const FONT_COLORS = [
  '#ffffff',
  '#75b3ff',
  '#c2a6ff',
  '#b8b8b8',
]


export interface WordCloudProps {
  data?: WordCloudItem[];
  sx?: SxProps;
}

export function WordCloud(props: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [redrawBase, setRedrawBase] = useState(0);
  useResizeObserver(containerRef, () => {
    // force redraw on container resize
    setRedrawBase(x => x + 1);
  });

  // draw base
  useEffect(() => {
    if (!containerRef.current || !props.data)
      return;

    const container = d3.select(containerRef.current);
    const containerBounds = container.node()!.getBoundingClientRect();

    const width = containerBounds.width - MARGINS.left - MARGINS.right;
    const height = containerBounds.height - MARGINS.top - MARGINS.bottom;

    // clear previous svg
    container.selectAll('svg').remove();

    // create new svg
    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${containerBounds.width} ${containerBounds.height}`);

    // create main group
    const mainGroup = svg.append('g')
      .classed('main-group', true)
      .attr('transform', `translate(${MARGINS.left + width / 2}, ${MARGINS.top + height / 2})`);

    // create font scale
    const fontScale = d3.scaleLinear()
      .domain(d3.extent(props.data, d => d.count) as [number, number])
      .range([10, 50]);

    function draw(words) {
      mainGroup.selectAll('text')
        .data(words)
        .join('text')
        .style('font-size', d => d.size + 'px')
        .style('font-family', 'Helvetica')
        .style('fill', (_d, i) => FONT_COLORS[i % FONT_COLORS.length])
        .attr('text-anchor', 'middle')
        .attr('transform', d => {
          return `translate(${d.x}, ${d.y})rotate(${d.rotate})`;
        })
        .text(d => d.text);
    }

    // create word cloud
    const layout = d3cloud()
      .size([width, height])
      .words(props.data?.map(d => ({text: d.word, size: d.count})) || [])
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize(d => fontScale(d.size))
      .on('end', draw);

    layout.start();

    // center word cloud
    const bounds = mainGroup.node()!.getBBox();
    mainGroup.attr('transform', `translate(${MARGINS.left - bounds.x + (width - bounds.width) / 2}, ${MARGINS.top - bounds.y + height / 2 - bounds.height / 2})`);

    // make svg fade in
    svg.style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);
  }, [redrawBase, props.data]);

  return (
    <Box ref={containerRef} sx={{...props.sx}} />
  )
}


export function WordCloudCard() {
  const [windowSize, setWindowSize] = useState<WindowSize>('week');

  const window = useMemo(() => getTimeRangeInSeconds(windowSize), [windowSize]);
  const { data, isLoading } = useGetWordcloudQuery({
    case_uuid: null,
    window_start: window[0],
    window_end: window[1],
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
    <Card
      sx={{
        p: 1.5, px: 3,
        transition: 'filter 0.25s ease',
        filter: isLoading ? 'blur(5px)' : 'none',
      }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">
          Word cloud
        </Typography>

        <SelectTimeWindow
          value={windowSize}
          onChange={(value) => setWindowSize(value)}
        />
      </Stack>

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
    </Card>
  );
}
