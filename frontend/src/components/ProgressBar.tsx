import {
  styled,
  LinearProgress,
  linearProgressClasses,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

export interface ProgressBarProps {
  totalAmount?: number;
  proggressedItemsSoFarAmount: number;
  placeHolderText?: string;
  text?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = (
  props: ProgressBarProps,
) => {
  const [progressBarValue, setProgressBarValue] = useState<number>();
  const [defualtText, setDefualtText] = useState<string>(
    `${props?.proggressedItemsSoFarAmount} / ${props?.totalAmount}`,
  );
  useEffect(() => {
    if (props.totalAmount) {
      setProgressBarValue(
        (props.proggressedItemsSoFarAmount / props.totalAmount) * 100,
      );
    } else {
      setProgressBarValue(props.proggressedItemsSoFarAmount);
      setDefualtText(props?.proggressedItemsSoFarAmount.toString());
    }
  }, [props.proggressedItemsSoFarAmount]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          margin: "20px 0",
          display: "flex",
          position: "relative",
          height: "24px",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{
            mb: 1,
            position: "absolute",
            opacity:
              props.proggressedItemsSoFarAmount && props.placeHolderText
                ? 0
                : 1,
            transition: "opacity 100ms",
          }}
          gutterBottom
        >
          {props.placeHolderText}
        </Typography>
        <Typography
          variant="h6"
          fontFamily="Helvetica Medium"
          sx={{
            mb: 1,
            position: "absolute",
            opacity: props.proggressedItemsSoFarAmount ? 1 : 0,
            transition: "opacity 500ms",
          }}
          gutterBottom
        >
          {props.text ? props.text : defualtText}
        </Typography>
      </Box>
      <BorderLinearProgress
        variant="indeterminate"
        value={progressBarValue ?? 0}
      />
    </Box>
  );
};
