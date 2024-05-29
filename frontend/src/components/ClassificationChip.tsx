import { Chip, SxProps } from "@mui/material";
import { Classification } from "../common/types.ts";

export interface PriorityChipProps {
  value: Classification;
  sx?: SxProps;
}

export default function ClassificationChip(props: PriorityChipProps) {
  switch (props.value) {
    case Classification.UNKNOWN:
      return (
        <Chip
          label="Unknown"
          sx={{
            color: "#b8b8b8",
            bgcolor: "#b8b8b833",
            minWidth: 85,
            ...props.sx,
          }}
        />
      );

    case Classification.BENIGN:
      return (
        <Chip
          label="Benign"
          sx={{
            color: "#62ff84",
            bgcolor: "#62ff8433",
            minWidth: 85,
            ...props.sx,
          }}
        />
      );

    case Classification.MALICIOUS:
      return (
        <Chip
          label="Malicious"
          sx={{
            color: "#ff4e4e",
            bgcolor: "#ff48484c",
            minWidth: 85,
            ...props.sx,
          }}
        />
      );

    case Classification.UN_PROCESSED:
      return (
        <Chip
          label="Not Inferenced Yet"
          sx={{
            color: "#FDFCFB",
            bgcolor: "#BDBDBD",
            minWidth: 85,
            ...props.sx,
          }}
        />
      );

    default:
      return <></>;
  }
}
