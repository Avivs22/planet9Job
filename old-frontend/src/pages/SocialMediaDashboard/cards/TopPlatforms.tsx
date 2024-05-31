import {Box, Card, SxProps, Typography} from "@mui/material";
import {EXAMPLE_PLATFORM_DATA} from "../common/example.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import useResizeObserver from "@react-hook/resize-observer";
import * as d3 from "d3";

import twitterLogo from '../../../assets/icons/social-media/twitter.svg';
import redditLogo from '../../../assets/icons/social-media/reddit.svg';
import tiktokLogo from '../../../assets/icons/social-media/tiktok.svg';
import instagramLogo from '../../../assets/icons/social-media/instagram.svg';
import facebookLogo from '../../../assets/icons/social-media/facebook.svg';
import {PlatformCircleDescriptor} from "../common/common.ts";
import {useGetPlatformStatsQuery} from "../../../common/api.ts";
import {Platform} from "../../../common/types.ts";


const MIN_CIRCLE_RADIUS = 10;
const MAX_CIRCLE_RADIUS = 110;

interface CircleStyle {
  color: string;
  logo: string;
}

type CircleStyleMap = {
  [key in Platform]: CircleStyle;
};

const CIRCLE_STYLES: CircleStyleMap = {
  [Platform.TWITTER]: {
    color: '#477ab9',
    logo: twitterLogo,
  },
  [Platform.REDDIT]: {
    color: '#8f544a',
    logo: redditLogo,
  },
  [Platform.INSTAGRAM]: {
    color: '#647f9d',
    logo: instagramLogo,
  },
  [Platform.TIKTOK]: {
    color: '#213c5f',
    logo: tiktokLogo,
  },
  [Platform.FACEBOOK]: {
    color: '#4676ed80',
    logo: facebookLogo,
  },
};


interface PlatformBoxProps {
  sx?: SxProps;
  data?: PlatformCircleDescriptor[];
}

function PlatformBox(props: PlatformBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // // create white drop shadow glow
    // const filter = defs.append('filter')
    //   .attr('id', 'glow')
    //   .attr('height', '130%')
    //   .attr('width', '130%')
    //   .attr('x', '-15%')
    //   .attr('y', '-15%');
    //
    // filter.append('feOffset')
    //   .attr('result', 'offOut')
    //   .attr('in', 'SourceGraphic')
    //   .attr('dx', 0)
    //   .attr('dy', 0);
    //
    // filter.append('feGaussianBlur')
    //   .attr('result', 'blurOut')
    //   .attr('in', 'offOut')
    //   .attr('stdDeviation', 10);
    //
    // filter.append('feBlend')
    //   .attr('in', 'SourceGraphic')
    //   .attr('in2', 'blurOut')
    //   .attr('mode', 'normal');

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
        return d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS - 5;
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
            .attr('opacity', 0);

          group.transition().attr('opacity', 1);

          // draw circles
          group
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', d => d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS)
            .attr('fill', d => CIRCLE_STYLES[d.platform].color)

          // draw platform logo in the center
          group
            .append('image')
            .attr('pointer-events', 'none')
            .attr('href', d => CIRCLE_STYLES[d.platform].logo)
            .attr('width', d => 0.8 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS))
            .attr('height', d => 0.8 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS))
            .attr('x', d => -0.4 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS))
            .attr('y', d => -0.4 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS));

          // add hover effect
          group
            .on('mouseenter', function () {
              d3.select(this).select('circle').transition().attr('filter', 'url(#glow)');

              // increase radius
              d3.select(this).select('circle').transition().attr('r', d => {
                return 1.2 * (d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS);
              });
            })
            .on('mouseleave', function () {
              d3.select(this).select('circle').transition().attr('filter', '');

              // decrease radius
              d3.select(this).select('circle').transition().attr('r', d => {
                return d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS;
              });
            });

          return group;
        }
      )

    simulation
      .nodes(data)
      .on('tick', function () {
        circleGroups.attr('transform', d => {
          const radius = d.relativeSize * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) + MIN_CIRCLE_RADIUS;
          d.x = Math.min(Math.max(d.x, -bounds.width / 2 + radius), bounds.width / 2 - radius);
          d.y = Math.min(Math.max(d.y, -bounds.height / 2 + radius + 20), bounds.height / 2 - radius - 20);

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


export function TopPlatformsCard() {
  const { data, isLoading } = useGetPlatformStatsQuery({});

  const circles = useMemo<null | PlatformCircleDescriptor[]>(() => {
    if (!data)
      return null;

    const totalSum = Object.values(data.platforms).reduce((acc, cur) => acc + cur, 0);

    return Object.entries(data.platforms).map(([platform, count]) => {
      return {
        id: platform,
        platform: platform as Platform,
        relativeSize: totalSum > 0 ? count / totalSum : 0.0,
      };
    });
  }, [data]);

  return (
    <Card
      sx={{
        p: 1.5, px: 3,
        transition: 'filter 0.25s ease',
        filter: isLoading ? 'blur(5px)' : 'none',
    }}
    >
      <Typography variant="h5">
        Top platforms
      </Typography>

      <Box sx={{ position: 'relative', height: 265, my: 2 }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          {circles && (
            <PlatformBox
              data={circles}
              sx={{
                height: '100%',
              }}
            />
          )}
        </Box>
      </Box>
    </Card>
  );
}