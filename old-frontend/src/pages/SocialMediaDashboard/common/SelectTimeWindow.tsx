import {NiceSelect} from "./common.ts";
import {InputAdornment, MenuItem, Typography} from "@mui/material";
import {WindowSize} from "../../../common/types.ts";


export interface SelectTimeWindowProps {
  value: WindowSize;
  onChange: (value: WindowSize) => void;
}

export function SelectTimeWindow(props: SelectTimeWindowProps) {
  return (
    <NiceSelect
      variant="standard"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as WindowSize)}
      startAdornment={
        <InputAdornment position="start" disablePointerEvents sx={{pointerEvents: 'none'}}>
          <Typography variant="body2" sx={{pointerEvents: 'none', color: '#d4d7da'}}>Show:</Typography>
        </InputAdornment>
      }
    >
      <MenuItem value="day">Today</MenuItem>
      <MenuItem value="week">This Week</MenuItem>
      <MenuItem value="month">This Month</MenuItem>
      <MenuItem value="year">Past Year</MenuItem>
    </NiceSelect>
  )
}