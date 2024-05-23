import {Box, Button, CircularProgress, Stack, SxProps, Typography} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import * as d3 from 'd3';
import useResizeObserver from "@react-hook/resize-observer";
import {Add} from "@mui/icons-material";
import {AddCaseDialog} from "../../dialogs/AddCase.tsx";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {useListCasesQuery} from "../../common/api.ts";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";


const MIN_CIRCLE_RADIUS = 40;
const MAX_CIRCLE_RADIUS = 120;

enum CircleColor {
  WHITE = 'white',
  BLUE = 'blue',
  PURPLE = 'purple',
}

interface CircleDescriptor {
  id: string;
  relativeSize: number; // 0.0 - 1.0
  title: string;
  color: CircleColor;
}

interface CircleStyle {
  textColor: string;
  start: string;
  stop: string;
}

type CircleStyleMap = {
  [key in CircleColor]: CircleStyle;
};

const CIRCLE_COLORS: CircleStyleMap = {
  [CircleColor.WHITE]: {
    textColor: 'black',
    start: '#ffffff',
    stop: '#ffffff',
  },
  [CircleColor.BLUE]: {
    textColor: 'white',
    start: '#90c2ff',
    stop: '#60a7ff',
  },
  [CircleColor.PURPLE]: {
    textColor: 'white',
    start: '#a5a4ff',
    stop: '#5d43ff',
  },
}

const EXAMPLE_CIRCLES: CircleDescriptor[] = [
  {id: '#0', relativeSize: 0.5, title: 'Circle 1', color: CircleColor.WHITE},
  {id: '#1', relativeSize: 1.0, title: 'Circle 2', color: CircleColor.BLUE},
  {id: '#2', relativeSize: 0.01, title: 'Circle 3 and bla bla bla', color: CircleColor.PURPLE},
  {id: '#3', relativeSize: 0.2, title: 'Pasten', color: CircleColor.PURPLE},
  {id: '#4', relativeSize: 0.4, title: 'Ipsum', color: CircleColor.BLUE},
  {id: '#5', relativeSize: 0.8, title: 'Bla', color: CircleColor.WHITE},
];


interface CaseBoxProps {
  sx?: SxProps;
  data?: CircleDescriptor[];
}

function CaseBox(props: CaseBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [redrawBase, setRedrawBase] = useState(0);
  useResizeObserver(containerRef, () => {
    // force redraw on container resize
    setRedrawBase(x => x + 1);
  });

  // FIXME: remove this in favor of better data update mechanism
  useEffect(() => {
    setRedrawBase(x => x + 1);
  }, [props.data]);

  // draw base
  useEffect(() => {
    if (!containerRef.current)
      return;

    const container = d3.select(containerRef.current);
    const containerBounds = container.node()!.getBoundingClientRect();

    // clear previous svg
    container.selectAll('svg').remove();

    // create new svg
    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${containerBounds.width} ${containerBounds.height}`);

    // add gradients
    const defs = svg.append('defs');
    Object.entries(CIRCLE_COLORS).forEach(([key, value]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${key}`)
        .attr('gradientTransform', 'rotate(90)');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', value.start);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', value.stop);
    });

    // create white drop shadow glow
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('height', '130%')
      .attr('width', '130%')
      .attr('x', '-15%')
      .attr('y', '-15%');

    filter.append('feOffset')
      .attr('result', 'offOut')
      .attr('in', 'SourceGraphic')
      .attr('dx', 0)
      .attr('dy', 0);

    filter.append('feGaussianBlur')
      .attr('result', 'blurOut')
      .attr('in', 'offOut')
      .attr('stdDeviation', 10);

    filter.append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blurOut')
      .attr('mode', 'normal');

    svg.append('g')
      .classed('main', true)
      .attr('transform', `translate(${containerBounds.width / 2}, ${containerBounds.height / 2})`);
  }, [redrawBase]);

  // initialize simulation
  const simulation = useMemo(() => {
    return d3.forceSimulation()
      .force('center', d3.forceCenter(0, 0))
      .force('charge', d3.forceManyBody().strength(200))
      .force('collision', d3.forceCollide().strength(0.3).radius(d => {
        return d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS + 20;
      }).iterations(1));
  }, [redrawBase]);

  // draw data
  const data = props.data;
  useEffect(() => {
    if (!data)
      return;

    const container = d3.select(containerRef.current);
    const bounds = container.node()!.getBoundingClientRect();

    const svg = container.select('svg');
    const mainGroup = svg.select('g.main');

    const circleGroups = mainGroup.selectAll('g')
      .data(data, d => d.id)
      .join(
        enter => {
          const group = enter.append('g')
            .attr('opacity', 0)
            .attr('cursor', 'pointer');

          group.transition().attr('opacity', 1);

          // draw circles
          group
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', d => d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS)
            .attr('fill', d => `url(#gradient-${d.color})`)

          // draw text in the center, and clip it inside circle
          group
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', d => CIRCLE_COLORS[d.color].textColor)
            .attr('font-size', '1.3rem')
            .attr('pointer-events', 'none')
            .text(d => d.title)
            .call(text => text.each(function (d) {
              const text = d3.select(this);
              const circle = d3.select(this.parentNode).select('circle');

              const radius = circle.attr('r');
              const diameter = 2 * radius - 25;

              const textLength = text.node()!.getComputedTextLength();
              const textHeight = text.node()!.getBBox().height;

              const scale = Math.min(diameter / textLength, diameter / textHeight, 1);

              text.attr('transform', `scale(${scale})`);
            }));

          // add hover effect
          group
            .on('mouseenter', function () {
              d3.select(this).select('circle').transition().attr('filter', 'url(#glow)');

              // increase radius
              d3.select(this).select('circle').transition().attr('r', d => {
                return 1.05 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS);
              });
            })
            .on('mouseleave', function () {
              d3.select(this).select('circle').transition().attr('filter', '');

              // decrease radius
              d3.select(this).select('circle').transition().attr('r', d => {
                return d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS;
              });
            })
            .on('click', function () {
              // get datum id
              const id = d3.select(this).datum().id;
              navigate(`/dashboard/cases/${id}`);
            })

          return group;
        }
      )

    simulation
      .nodes(data)
      .on('tick', function () {
        circleGroups.attr('transform', d => {
          const radius = d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS;
          d.x = Math.min(Math.max(d.x, -bounds.width / 2 + radius), bounds.width / 2 - radius);
          d.y = Math.min(Math.max(d.y, -bounds.height / 2 + radius + 20), bounds.height / 2 - radius);

          return `translate(${d.x}, ${d.y})`;
        });
      })
      .restart();
  }, [redrawBase, data, simulation]);

  return (
    <Box ref={containerRef} sx={{...props.sx}}>

    </Box>
  );
}


interface AddCaseParams {
  name: string;
}

interface AddCaseResponse {
}

function useAddCaseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: AddCaseParams) => {
      return (await axios.post('/api/cases/add', params)).data as AddCaseResponse;
    },
    async onSuccess() {
      await queryClient.invalidateQueries('list-cases');
    }
  })
}

function AddCaseButton() {
  const [addOpen, setAddOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const addCase = useAddCaseMutation();
  const loading = addCase.isLoading;
  const handleAddCase = async (name: string) => {
    await addCase.mutateAsync({name});
    enqueueSnackbar('Case created', {variant: 'success'});
  };

  return (
    <>
      <AddCaseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleAddCase}
      />

      <Button
        variant="contained"
        sx={{
          color: 'white',
          textTransform: 'none',
          borderRadius: '16px',
        }}
        startIcon={<Add/>}
        onClick={() => setAddOpen(true)}
        disabled={loading}
      >
        {loading ? "Adding case..." : "New case"}
        {loading && <CircularProgress size={16} sx={{ ml: 2 }} />}
      </Button>
    </>
  );
}


const _SORTED_COLORS = [
  CircleColor.BLUE,
  CircleColor.WHITE,
  CircleColor.PURPLE,
];

export function CasesPage() {
  const {data, isLoading} = useListCasesQuery({});
  const [firstLoading, setFirstLoading] = useState(true);

  const [cases, setCases] = useState<null | CircleDescriptor[]>(null);

  useEffect(() => {
    if (data && !isLoading) {
      setFirstLoading(false);

      setCases(data.items.map((item, i) => {
        return {
          id: item.uuid,
          relativeSize: item.rel_size,
          title: item.name,
          color: _SORTED_COLORS[i % _SORTED_COLORS.length],
        };
      }));
    }
  }, [data, isLoading]);


  return (
    <Stack sx={{p: 5, pb: 0, height: '100%', boxSizing: 'border-box'}}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" sx={{mb: 3}}>
          Cases
        </Typography>

        <Box sx={{flex: 1}}/>

        <AddCaseButton/>
      </Stack>

      <Box sx={{flex: 1, position: 'relative'}}>
        <Box sx={{position: 'absolute', inset: 0}}>
          {firstLoading && isLoading && (
            <Stack
              sx={{
                // center
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              alignItems="center"
              spacing={2}
            >
              <CircularProgress size={100}/>
              <Typography variant="body2" fontStyle="italic">Loading cases...</Typography>
            </Stack>
          )}

          {cases && (
            <CaseBox
              sx={{
                width: '100%',
                height: '100%',
              }}
              data={cases}
            />
          )}
        </Box>
      </Box>
    </Stack>
  );
}