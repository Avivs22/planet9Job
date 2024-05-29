import {
  SocialMediaItem,
  SocialMediaScraperData,
  SocialMediaScrapeResult,
} from "../../common/types.ts";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { getMediaUrl } from "../../common/utils.ts";

import moreIcon from "../../assets/icons/social-media/instagram/more.png";
import playIcon from "../../assets/icons/social-media/instagram/play.png";
import buttonsImage from "../../assets/icons/social-media/instagram/buttons.png";

interface RawInstagramComment {
  id: string;
  text: string;
  timestamp: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  likesCount: number;
}

interface RawInstagramPostData {
  shortCode: string;
  caption: string;
  displayUrl: string;
  ownerUsername: string;
  latestComments: RawInstagramComment[];
  likesCount: number;
  timestamp: string;
  type: string;
}

interface RawInstagramUserData {
  username: string;
  fullName: string;
  profilePicUrl: string;
}

interface RawInstagramData {
  main: RawInstagramPostData;
  profile: RawInstagramUserData;
}

interface UserCommentProps {
  comment: RawInstagramComment;
}

function UserComment(props: UserCommentProps) {
  return (
    <Stack direction="row" spacing="16px" sx={{ boxSizing: "border-box" }}>
      <img
        src={getMediaUrl(props.comment.ownerProfilePicUrl)}
        alt="?"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "solid 1px #bbb",
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Box sx={{ wordBreak: "break-all !important" }}>
          <Typography
            component="span"
            sx={{ color: "black", fontSize: "14px", fontWeight: "bold" }}
          >
            {props.comment.ownerUsername}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "black",
              fontSize: "14px",
              ml: "4px",
              wordBreak: "normal",
            }}
          >
            {props.comment.text}
          </Typography>
        </Box>

        <Stack direction="row" sx={{ mt: "4px" }} spacing="12px">
          <Typography sx={{ fontSize: "12px", color: "rgb(115, 115, 115)" }}>
            {new Date(props.comment.timestamp).toLocaleString()}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "rgb(115, 115, 115)",
            }}
          >
            Reply
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

interface ReelBoxProps {
  result: SocialMediaScrapeResult;
}

function ReelBox(props: ReelBoxProps) {
  const { result } = props;
  const raw = result.raw as RawInstagramData;
  const main = raw.main;

  const displayUrl = main.displayUrl;

  console.log("R", result);

  return (
    <Stack
      sx={{
        width: 334 * 2,
        height: 600,
        bgcolor: "white",
        border: "solid 1px gray",
        borderRadius: "2px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important',
        color: "black !important",
      }}
      direction="row"
    >
      <Box sx={{ flex: 1, width: 334, position: "relative" }}>
        <img
          src={getMediaUrl(displayUrl)}
          alt="Image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {raw.main.type === "Video" && (
          <img
            src={playIcon}
            style={{
              width: "130px",
              height: "100px",
              objectFit: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectPosition: "top left",
            }}
          />
        )}
      </Box>

      <Stack sx={{ width: "50%", flex: 1 }}>
        <Stack
          direction="row"
          sx={{
            px: "16px",
            py: "14px",
            borderBottom: "solid 1px #eee",
            overflow: "hidden",
          }}
          spacing="16px"
        >
          <img
            src={getMediaUrl(raw.profile.profilePicUrl)}
            alt="Owner"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "solid 1px #bbb",
            }}
          />

          <Stack sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{ color: "black", fontSize: "14px", fontWeight: "bold" }}
              >
                {raw.main.ownerUsername}
              </Typography>
              <Typography sx={{ color: "black" }}>•</Typography>
              <Typography
                sx={{
                  color: "rgb(0, 149, 246)",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Follow
              </Typography>
            </Stack>
            <Typography></Typography>
          </Stack>

          <img src={moreIcon} />
        </Stack>

        <Box sx={{ flex: 1, position: "relative", marginBottom: "5px" }}>
          <Stack
            sx={{
              p: "16px",
              position: "absolute",
              inset: 0,
              overflowY: "auto",
            }}
            spacing="12px"
          >
            {main.latestComments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </Stack>
        </Box>

        <Box
          sx={{ borderTop: "solid 1px #eee", p: "16px", overflow: "hidden" }}
        >
          <img
            src={buttonsImage}
            style={{
              display: "table",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "8px",
            }}
          />

          <Typography
            component="span"
            sx={{ color: "black", fontSize: "14px", fontWeight: "bold" }}
          >
            {raw.main.likesCount} likes
          </Typography>

          <Typography sx={{ fontSize: "12px", color: "rgb(115, 115, 115)" }}>
            {new Date(raw.main.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export interface InstagramItemSnapshotProps {
  item: SocialMediaItem;
  scraper?: SocialMediaScraperData;
  noBorder?: boolean;
}

export function InstagramItemSnapshot(props: InstagramItemSnapshotProps) {
  const result = props.scraper?.result;

  if (!result) return <></>;

  // return (
  //   <Alert severity="warning">
  //     No preview available yet
  //   </Alert>
  // )

  return <ReelBox result={result} />;
}
