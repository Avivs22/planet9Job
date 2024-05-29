import { AppBar, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SIDEBAR_WIDTH } from "./Sidebar";
import { AccountCircle, Leaderboard } from "@mui/icons-material";
import { useAtom, useSetAtom } from "jotai";
import { longModeAtom, longModeLockedAtom } from "../state/ui.ts";

export const APPBAR_HEIGHT = 80;

function UserInfo() {
  const [longMode, setLongMode] = useAtom(longModeAtom);
  const setLongModeLocked = useSetAtom(longModeLockedAtom);

  const handleChangeLongMode = (
    _event: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    setLongMode(value === "horizontal");
    setLongModeLocked(true);
  };

  return (
    <Stack direction="row" sx={{ mr: 3 }} spacing={3} alignItems="center">
      <ToggleButtonGroup
        value={longMode ? "horizontal" : "vertical"}
        exclusive
        onChange={handleChangeLongMode}
      >
        <ToggleButton value="horizontal">
          <Leaderboard sx={{ color: "white " }} />
        </ToggleButton>
      </ToggleButtonGroup>

      <AccountCircle sx={{ color: "white", width: 48, height: 48 }} />
      {/*<Stack>*/}
      {/*  <Typography sx={{color: 'black'}} fontSize={14}>pasten@gmail.com</Typography>*/}
      {/*  <Typography sx={{color: '#888', mt: -0.2}} variant="body2" fontSize={12}>Pastenino</Typography>*/}
      {/*</Stack>*/}
    </Stack>
  );
}

export default function MainAppBar() {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          ml: `${SIDEBAR_WIDTH}px`,
          height: APPBAR_HEIGHT,
          background: "#282832",
        }}
      >
        <Stack
          sx={{ width: "100%", height: "100%" }}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <UserInfo />
        </Stack>
      </AppBar>
    </>
  );
}
