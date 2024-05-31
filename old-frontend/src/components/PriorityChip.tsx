import {Chip, SxProps} from '@mui/material';
import {Priority} from "../common/types.ts";

export interface PriorityChipProps {
  value: Priority;
  sx?: SxProps;
}

export default function PriorityChip(props: PriorityChipProps) {
  switch (props.value) {
    case Priority.LOW:
      return (
        <Chip
          label="Low"
          sx={{color: '#37ce4a', bgcolor: '#37ce4a33', minWidth: 85, ...props.sx }}
        />
      );

    case Priority.MEDIUM:
      return (
        <Chip
          label="Medium"
          sx={{color: '#75b3ff', bgcolor: '#75b3ff33', minWidth: 85, ...props.sx }}
        />
      );

    case Priority.HIGH:
      return (
        <Chip
          label="High"
          sx={{color: '#ff7a00', bgcolor: '#ff7a0033', minWidth: 85, ...props.sx }}
        />
      );

    default:
      return <></>;
  }

}
