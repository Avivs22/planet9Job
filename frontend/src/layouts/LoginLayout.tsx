import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ElevatorCard from "../components/ElevatorCard";
import { Outlet, useNavigate } from "react-router-dom";
import { loginStateAtom } from "../state/ui.ts";
import { useAtom } from "jotai";

import "./styles.css";

export default function LoginLayout() {
  const [loginState, setLoginState] = useAtom(loginStateAtom);

  useEffect(() => {
    setLoginState(0);
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (loginState === 1) {
      setTimeout(() => {
        setLoginState(2);
      }, 1000);

      setTimeout(() => {
        setLoginState(3);
      }, 2000);

      setTimeout(() => {
        setLoginState(4);
        navigate("/dashboard");
      }, 3000);
    }
  }, [loginState]);

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "black",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          background: "linear-gradient(#000000, #004083)",
          width: "90%",
          pb: "49%",
          borderRadius: "16px",
        }}
      ></Box>

      <ElevatorCard
        sx={{
          position: "absolute",
          transition: "opacity 0.5s ease-in-out",
          display: loginState >= 2 ? "none" : "block",
          ...(loginState > 0 ? { opacity: 0 } : {}),
        }}
      >
        <Outlet />
      </ElevatorCard>

      <Stack sx={{ position: "absolute" }} alignItems="center" spacing={5}>
        <CircularProgress
          size={loginState === 2 ? 128 : 384}
          thickness={32}
          sx={{
            color: "#C2A6FF",
            transition:
              "width 2s ease-in-out, height 2s ease-in-out, filter 2s ease-in-out, opacity 2s ease-in-out",
            display: loginState < 2 ? "none" : "block",
            ...(loginState === 3 ? { filter: "blur(20px)", opacity: 0 } : {}),
          }}
        />

        {/*<Typography variant="body2" fontStyle="italic">*/}
        {/*  Logging you in...*/}
        {/*</Typography>*/}
      </Stack>
    </Stack>
  );
}
