import React, { ReactNode } from "react";
import { Box, Card, SxProps } from "@mui/material";

export interface ElevatorCardProps {
  children: ReactNode;
  sx?: SxProps;
}

export default function ElevatorCard(props: ElevatorCardProps) {
  return (
    <Card
      sx={{
        "& div.MuiPaper-root": {
          background: "#cccccce0",
        },
        ...props.sx,
      }}
    >
      <Box
        sx={{
          m: 2.5,
          p: 3,
          px: 6,
          background: "#00366f",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        {props.children}
      </Box>
    </Card>
  );
}
