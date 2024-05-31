import {Select, styled} from "@mui/material";
import {atom} from "jotai";
import {ReactNode} from "react";
import {Platform, WindowSize} from "../../../common/types.ts";

export const NiceSelect = styled(Select)({
  '&.MuiInputBase-root': {
    background: 'linear-gradient(#ffffff4c 0%, #ffffff19 100%)',
    border: 'solid 1px #ffffff40',
  },
});



export type StatColor = 'white' | 'blue' | 'green';

export interface StatProps {
  title: string;
  value?: ReactNode;
  color?: StatColor;
}

export function getStatColor(label: StatColor) {
  switch (label) {
    case 'white':
      return '#fff';
    case 'blue':
      return '#75b3ff';
    case 'green':
      return '#0fdf63';
  }
}

export interface PlatformCircleDescriptor {
  id: string;
  relativeSize: number; // 0.0 - 1.0
  platform: Platform;
}


export interface WordCloudItem {
  word: string;
  count: number;
}
