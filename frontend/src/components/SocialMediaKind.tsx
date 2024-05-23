import { SocialMediaKind } from "../common/types.ts";
import { Chip, Stack, SxProps, Typography } from "@mui/material";
import { CSSProperties } from "react";

import twitterIcon from "../assets/icons/social-media/twitter.svg";
import instagramIcon from "../assets/icons/social-media/instagram.svg";
import tiktokIcon from "../assets/icons/social-media/tiktok.svg";

export interface SocialMediaKindTextProps {
  kind: SocialMediaKind;
  sx?: SxProps;
}

export function SocialMediaKindText(props: SocialMediaKindTextProps) {
  switch (props.kind) {
    case SocialMediaKind.TWITTER_POST:
    case SocialMediaKind.INSTAGRAM_POST:
    case SocialMediaKind.TIKTOK_VIDEO:
      return <Typography sx={{ ...props.sx }}>Post</Typography>;

    default:
      return <Chip label="Unknown" size="small" />;
  }
}

export interface SocialMediaKindIconProps {
  kind: SocialMediaKind;
  size?: number;
  style?: CSSProperties;
}

export function SocialMediaKindIcon(props: SocialMediaKindIconProps) {
  const size = props.size ?? 32;

  switch (props.kind) {
    case SocialMediaKind.TWITTER_POST:
      return (
        <img
          style={{ width: size, height: size, ...props.style }}
          src={twitterIcon}
          alt="Twitter"
        />
      );

    case SocialMediaKind.INSTAGRAM_POST:
      return (
        <img
          style={{ width: size, height: size, ...props.style }}
          src={instagramIcon}
          alt="Instagram"
        />
      );

    case SocialMediaKind.TIKTOK_VIDEO:
      return (
        <img
          style={{ width: size, height: size, ...props.style }}
          src={tiktokIcon}
          alt="Tiktok"
        />
      );

    default:
      return <></>;
  }
}

export interface SocialMediaKindIconWithTextProps {
  kind: SocialMediaKind;
  size?: number;
}

export function SocialMediaKindIconWithText(
  props: SocialMediaKindIconWithTextProps,
) {
  return (
    <Stack alignItems="center">
      <SocialMediaKindIcon kind={props.kind} size={props.size} />
      <SocialMediaKindText kind={props.kind} />
    </Stack>
  );
}
