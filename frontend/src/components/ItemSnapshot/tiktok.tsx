import {
  SocialMediaItem,
  SocialMediaScraperData,
  SocialMediaScrapeResult,
} from "../../common/types.ts";
import { Box, Stack, Typography } from "@mui/material";
import { getMediaUrl } from "../../common/utils.ts";
import { useEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

interface RawTiktokData {
  authorMeta: {
    avatar: string;
    name: string;
    nickName: string;
  };
  videoMeta: {
    downloadAddr: string;
    width: number;
    height: number;
  };
  text: string;
}

interface TiktokPreviewProps {
  result: SocialMediaScrapeResult;
  noBorder?: boolean;
}

function TiktokPreview(props: TiktokPreviewProps) {
  const raw = props.result.raw as RawTiktokData;

  const videoUrl = raw?.videoMeta?.downloadAddr;

  const containerRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState(0);
  useResizeObserver(containerRef, () => {
    // force redraw on container resize
    setCounter((x) => x + 1);
  });

  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const videoWidth = raw?.videoMeta?.width ?? 480;
    const videoHeight = raw?.videoMeta?.height ?? 600;
    const containerWidth = containerRef.current.clientWidth;

    if (videoWidth > containerWidth) {
      setVideoWidth(containerWidth);
      setVideoHeight((containerWidth * videoHeight) / videoWidth);
    } else {
      setVideoWidth(videoWidth);
      setVideoHeight(videoHeight);
    }
  }, [raw, counter]);

  return (
    <Stack
      ref={containerRef}
      sx={{
        borderRadius: "8px",
        border: props.noBorder ? "" : "solid 1px #555",
        fontFamily:
          "TikTokFont, Arial, Tahoma, PingFangSC, sans-serif; !important",
        overflow: "hidden",
      }}
    >
      <video width={videoWidth} height={videoHeight} controls>
        <source src={getMediaUrl(videoUrl)} type="video/mp4" />
      </video>

      <Box
        sx={{ bgcolor: "white", ...(videoWidth ? { width: videoWidth } : {}) }}
      >
        <Box sx={{ bgcolor: "rgba(22, 24, 35, 0.03)", p: "16px" }}>
          <Stack direction="row" spacing="16px">
            <img
              src={raw?.authorMeta?.avatar}
              style={{ width: 48, height: 48, borderRadius: "50%" }}
            />

            <Stack>
              <Typography
                sx={{ color: "black", fontSize: "18px", fontWeight: "bold" }}
              >
                {raw?.authorMeta?.name}
              </Typography>
              <Typography
                sx={{ color: "rgba(22, 24, 35, 0.75)", fontSize: "14px" }}
              >
                {raw?.authorMeta?.nickName}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            sx={{ color: "rgb(22, 24, 35)", fontSize: "16px", mt: "16px" }}
          >
            {raw?.text}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export interface TiktokItemSnapshotProps {
  item: SocialMediaItem;
  scraper?: SocialMediaScraperData;
  noBorder?: boolean;
}

export function TiktokItemSnapshot(props: TiktokItemSnapshotProps) {
  const result = props.scraper?.result;

  if (!result) return <></>;

  return <TiktokPreview result={result} noBorder={props.noBorder} />;
}
