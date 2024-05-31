import { Box, SxProps } from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "@react-hook/resize-observer";

const MARGIN = 50;
const OVERFLOW_MARGIN = 15;

export interface LimeTokenScore {
  token: string;
  importance: number;
}

export type LimeTokenScores = LimeTokenScore[];

export interface LimeData {
  tokenScores: LimeTokenScores;
}

export const EXAMPLE_LIME_DATA: LimeData = {
  tokenScores: [
    { token: "http", importance: 0.5 },
    { token: "www", importance: -0.3 },
    { token: "google", importance: -0.6 },
    { token: "com", importance: -0.4 },
  ],
};

const CLASS_COLORS = ["#75b3ff", "#fc812a"];

export interface LimeTokenBarsProps {
  data: LimeData;
  orientation?: "horizontal" | "vertical";
  sx?: SxProps;
  onOverflow?: (factor: number) => boolean;
}

export function LimeTokenBars(props: LimeTokenBarsProps) {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  // const [size, setSize] = useState<[number, number]>([0, 0]);

  const data = props.data;
  const orientation = props.orientation ?? "horizontal";

  useLayoutEffect(() => {
    if (!svgContainerRef.current) return;

    d3.select(svgContainerRef.current).selectAll("svg").remove();

    d3.select(svgContainerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");
  }, []);

  const [redraw, setRedraw] = useState(0);

  const barWidth = orientation == "horizontal" ? 25 : 15;
  const barMargin = 25;

  const computed = useMemo(() => {
    const container = svgContainerRef.current;
    if (!container) return null;

    const rect = container.getBoundingClientRect();

    let lineLength =
      (barWidth + barMargin) * data.tokenScores.length - barMargin;
    if (orientation == "vertical") {
      // make space for first label
      lineLength += barMargin;
    }

    const lineStart =
      orientation == "horizontal"
        ? rect.width / 2 - lineLength / 2
        : rect.height / 2 - lineLength / 2;

    return {
      textHeight: 20,
      lineStart,
      lineLength: lineLength,
      rect,
    };
  }, [redraw, data, orientation]);

  // draw svg base (without data)
  useEffect(() => {
    if (!computed) return;

    const container = svgContainerRef.current!;
    const rect = container.getBoundingClientRect();
    const svg = d3.select(container).select("svg");

    // clear svg
    svg.html("");
    if (orientation == "horizontal")
      svg.attr(
        "viewBox",
        `${computed.lineStart - 15} 0 ${computed.lineLength + 30} ${
          rect.height
        }`,
      );
    else
      svg.attr(
        "viewBox",
        `0 ${computed.lineStart - 15} ${rect.width} ${
          computed.lineLength + 30
        }`,
      );

    // compute overflow factor
    if (props.onOverflow) {
      const factor =
        orientation == "horizontal"
          ? computed.lineLength / rect.width
          : computed.lineLength / rect.height;

      props.onOverflow(factor);
    }

    // add main bar
    const mainLine = svg
      .append("line")
      .classed("main-line", true)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    if (orientation == "horizontal") {
      mainLine
        .attr("x1", computed.lineStart)
        .attr("x2", computed.lineStart + computed?.lineLength)
        .attr("y1", rect.height / 2)
        .attr("y2", rect.height / 2);
    } else {
      mainLine
        .attr("x1", rect.width / 2)
        .attr("x2", rect.width / 2)
        .attr("y1", computed.lineStart)
        .attr("y2", computed.lineStart + computed?.lineLength);
    }

    // add token importance group
    const mainG = svg.append("g").classed("token-importance-group", true);

    mainG.append("g").classed("text-group-1", true);
    mainG.append("g").classed("text-group-2", true);
    mainG.append("g").classed("bar-group", true);
  }, [redraw, orientation, computed]);

  // force redraw on resize
  const [skipRedraw, setSkipRedraw] = useState(false);
  useResizeObserver(svgContainerRef, () => {
    if (skipRedraw) setSkipRedraw(false);
    else setRedraw((x) => x + 1);
  });

  // draw data
  useEffect(() => {
    if (!computed) return;

    const rect = svgContainerRef.current!.getBoundingClientRect();
    const lineHeight = 2;
    const maxBarHeight = rect.height / 2 - MARGIN;

    const svg = d3.select(svgContainerRef.current!).select("svg");

    const tg = svg.select(".token-importance-group");
    const barG = svg.select(".bar-group");
    const textG1 = tg.select(".text-group-1");
    const textG2 = tg.select(".text-group-2");

    // change line width
    if (orientation == "horizontal") {
      svg
        .select(".main-line")
        .attr("x1", computed.lineStart)
        .attr("x2", computed.lineStart + computed?.lineLength);
    } else {
      svg
        .select(".main-line")
        .attr("y1", computed.lineStart)
        .attr("y2", computed.lineStart + computed?.lineLength);
    }

    const bars = barG
      .selectAll("rect")
      .data(data.tokenScores)
      .join("rect")
      .transition()
      .attr("fill", (d) =>
        d.importance > 0 ? CLASS_COLORS[1] : CLASS_COLORS[0],
      );

    if (orientation == "horizontal") {
      bars
        .attr("x", (_, i) => computed.lineStart + i * (barWidth + barMargin))
        .attr("y", (d) =>
          d.importance > 0
            ? rect.height / 2 - d.importance * maxBarHeight - 1
            : rect.height / 2 + lineHeight - 1,
        )
        .attr("width", barWidth)
        .attr("height", (d) => Math.abs(d.importance) * maxBarHeight);
    } else {
      bars
        .attr("x", (d) =>
          d.importance > 0
            ? rect.width / 2 - d.importance * maxBarHeight - 1
            : rect.width / 2 + lineHeight - 1,
        )
        .attr(
          "y",
          (_, i) => computed.lineStart + i * (barWidth + barMargin) + barMargin,
        )
        .attr("width", (d) => Math.abs(d.importance) * maxBarHeight)
        .attr("height", barWidth);
    }

    const textTokens = textG1
      .selectAll("text")
      .data(data.tokenScores)
      .join("text")
      .attr("fill", "#fff")
      .text((d) => d.token);

    if (orientation == "horizontal") {
      textTokens
        .attr(
          "transform",
          (d, i) => `
          translate(
            ${computed.lineStart + i * (barWidth + barMargin) + barWidth / 2},
            ${
              rect.height / 2 -
              d.importance * maxBarHeight -
              5 +
              (d.importance < 0
                ? computed.textHeight * 2 + 4
                : -computed.textHeight - 2)
            }
          )
          rotate(${d.importance > 0 ? "-45" : "45"})
        `,
        )
        .attr("text-anchor", "start");
    } else {
      textTokens
        .attr("x", (d) => rect.width / 2 + (d.importance < 0 ? 5 : -5))
        .attr(
          "y",
          (_, i) =>
            computed.lineStart + i * (barWidth + barMargin) + barMargin / 2,
        )
        .attr("text-anchor", (d) => (d.importance < 0 ? "start" : "end"))
        .attr("dominant-baseline", "middle");
    }

    const scoreTokens = textG2
      .selectAll("text")
      .data(data.tokenScores)
      .join("text")
      .attr("fill", "#fff")
      .text((d) => d.importance.toFixed(2));

    if (orientation == "horizontal") {
      scoreTokens
        .attr(
          "x",
          (_, i) =>
            computed.lineStart + i * (barWidth + barMargin) + barWidth / 2,
        )
        .attr(
          "y",
          (d) =>
            rect.height / 2 -
            d.importance * maxBarHeight -
            5 +
            (d.importance < 0 ? computed.textHeight + 4 : -2),
        )
        .attr("text-anchor", "middle");
    } else {
      scoreTokens
        .attr(
          "x",
          (d) =>
            rect.width / 2 -
            d.importance * maxBarHeight +
            (d.importance < 0 ? 5 : -5),
        )
        .attr(
          "y",
          (_, i) =>
            computed.lineStart +
            i * (barWidth + barMargin) +
            barMargin +
            barWidth / 2,
        )
        .attr("text-anchor", (d) => (d.importance < 0 ? "start" : "end"))
        .attr("dominant-baseline", "middle");
    }
  }, [redraw, data, orientation]);

  return (
    <Box
      sx={{
        ...props.sx,
      }}
      ref={svgContainerRef}
    ></Box>
  );
}

export interface LimeSummaryBarsProps {
  values: number[];
  classes: string[];
  width?: number;
}

export function LimeSummaryBars(props: LimeSummaryBarsProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const svgWidth = props.width ?? 225;
  const textMargin = 80;

  const barWidth = svgWidth - textMargin;
  const barHeight = 25;
  const barMargin = 10;

  const svgHeight =
    barHeight * props.values.length + barMargin * (props.values.length - 1);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current!);

    svg.html("");

    const borderG = svg.append("g").classed("border-group", true);

    svg.append("g").classed("fill-group", true);

    borderG
      .selectAll("text")
      .data(props.classes)
      .join("text")
      .attr("x", 0)
      .attr("y", (_, i) => i * (barHeight + barMargin) + barHeight / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#fff")
      .text((d) => d);

    borderG
      .selectAll("rect")
      .data(props.classes)
      .join("rect")
      .attr("x", textMargin)
      .attr("y", (_, i) => i * (barHeight + barMargin))
      .attr("width", barWidth)
      .attr("height", barHeight)
      .attr("stroke", (_, i) => CLASS_COLORS[i])
      .attr("stroke-width", 2)
      .attr("fill", "transparent");
  }, [props.width]);

  // const [redraw, setRedraw] = useState(0);
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current!);
    const fillG = svg.select(".fill-group");

    fillG
      .selectAll("rect")
      .data(props.values)
      .join("rect")
      .transition()
      .attr("x", textMargin)
      .attr("y", (_, i) => i * (barHeight + barMargin))
      .attr("width", (d) => d * barWidth)
      .attr("height", barHeight)
      .attr("fill", (_, i) => CLASS_COLORS[i]);

    fillG
      .selectAll("text")
      .data(props.values)
      .join("text")
      .attr("x", textMargin + barWidth - 10)
      .attr("y", (_, i) => i * (barHeight + barMargin) + barHeight / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#fff")
      .text((d) => d.toFixed(2));
  }, [props.width, props.values, props.classes]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}
