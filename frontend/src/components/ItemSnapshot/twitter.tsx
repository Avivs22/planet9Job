import { SocialMediaItem, SocialMediaScraperData } from "../../common/types.ts";
import { Box, Stack, Typography } from "@mui/material";

interface RawTwitterUser {
  profile_image_url_https: string;
  screen_name: string;
  name: string;
}

interface RawTwitterMedia {
  type: string;
  media_url: string;
  video_url?: string;
}

interface RawTwitterData {
  id: string;
  user: RawTwitterUser;
  conversation_id: string;
  full_text: string;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  view_count: number;
  quote_count: number;
  created_at: string;
  media: RawTwitterMedia[];
}

function htmlDecode(input?: string) {
  if (!input) return undefined;
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

interface TweetBoxProps {
  tweet: RawTwitterData;
  noBorder?: boolean;
}

function TweetBox(props: TweetBoxProps) {
  const { tweet } = props;

  return (
    <Box
      sx={{
        bgcolor: "black",
        color: "white",
        borderRadius: "8px",
        border: props.noBorder ? "" : "solid 1px #ffffff60",
        fontFamily:
          '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important',
        p: 2,
        maxWidth: "566px",
        boxSizing: "content-box",
      }}
    >
      {tweet?.user && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <img
            src={tweet.user.profile_image_url_https}
            alt="Profile"
            style={{ borderRadius: "50%" }}
          />

          <Box>
            <Typography sx={{ fontSize: "15px", lineHeight: "20px" }}>
              {tweet.user.name}
            </Typography>

            <Typography
              sx={{
                fontSize: "15px",
                color: "rgb(113, 118, 123)",
                lineHeight: "20px",
              }}
            >
              @{tweet.user.screen_name}
            </Typography>
          </Box>
        </Stack>
      )}

      <Typography whiteSpace="pre-wrap" sx={{ mt: "16px" }}>
        {htmlDecode(tweet?.full_text)}
      </Typography>

      {tweet?.media && tweet.media.length > 0 && (
        <Box>
          <img
            src={tweet.media[0].media_url}
            alt="Media"
            style={{
              marginTop: "16px",
              borderRadius: "16px",
              width: "100%",
              // display: 'table',
              // marginLeft: 'auto',
              // marginRight: 'auto',
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export interface TwitterItemSnapshotProps {
  item: SocialMediaItem;
  scraper?: SocialMediaScraperData;
  noBorder?: boolean;
}

export function TwitterItemSnapshot(props: TwitterItemSnapshotProps) {
  const tweetData = (props.scraper?.result?.raw ??
    null) as null | RawTwitterData;

  if (!tweetData) return <></>;

  return <TweetBox tweet={tweetData} noBorder={props.noBorder} />;
}
