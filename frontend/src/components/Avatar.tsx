import { AnalystInfo } from "../common/types.ts";
import { Stack, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import nimrodAvatar from "../assets/avatars/nimrod.png";

export interface AvatarProps {
  analyst?: AnalystInfo;
  size?: number;
  orientation: "horizontal" | "vertical";
  noName?: boolean;
}

function makeAvatarIcon(username: undefined | string, size: number) {
  switch (username) {
    case "nimrod":
      return <img src={nimrodAvatar} alt="Nimrod" width={size} height={size} />;

    default:
      return (
        <AccountCircle sx={{ color: "white", width: size, height: size }} />
      );
  }
}

export function Avatar(props: AvatarProps) {
  const fullName = props.analyst?.full_name ?? "";
  const firstName = fullName.split(" ")[0];
  const size = props.size ?? 48;

  const noName = props.noName ?? false;

  return (
    <Stack
      direction={props.orientation === "vertical" ? "column" : "row"}
      alignItems="center"
      spacing={props.orientation === "vertical" ? 0 : 1}
    >
      {makeAvatarIcon(props.analyst?.username, size)}
      {!noName && <Typography>{firstName}</Typography>}
    </Stack>
  );
}
