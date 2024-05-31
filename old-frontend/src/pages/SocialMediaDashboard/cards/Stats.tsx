import {NiceSelect, StatProps, statWindowSizeAtom} from "../common/common.ts";
import {Card, InputAdornment, MenuItem, Stack, Table, Typography} from "@mui/material";
import {useAtom} from "jotai";
import {WindowSize} from "../../../common/types.ts";
import {useGetSDBStatsQuery} from "../../../common/api.ts";
import {useState} from "react";

function StatBox(props: StatProps) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{minHeight: '120px'}}>
      <Typography variant="h4">
        {props.value}
      </Typography>
      <Typography
        sx={{color: '#ffffffb2'}}
        fontFamily="Helvetica"
        variant="body2"
      >
        {props.title}
      </Typography>
    </Stack>
  )
}


export function StatsCard() {
  const [windowSize, setWindowSize] = useState<WindowSize>('all');

  const { data, isLoading } = useGetSDBStatsQuery({
    window_size: windowSize,
  });

  return (
    <Card
      sx={{
        p: 1.5, px: 3,
        transition: 'filter 0.25s ease',
        filter: isLoading ? 'blur(5px)' : 'none',
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">
          Stats
        </Typography>

        <NiceSelect
          variant="standard"
          value={windowSize}
          onChange={(e) => setWindowSize(e.target.value as WindowSize)}
          startAdornment={
            <InputAdornment position="start" disablePointerEvents sx={{pointerEvents: 'none'}}>
              <Typography variant="body2" sx={{pointerEvents: 'none', color: '#d4d7da'}}>Show:</Typography>
            </InputAdornment>
          }
        >
          <MenuItem value="all">All</MenuItem>
        </NiceSelect>
      </Stack>

      <Table
        sx={{
          width: '100%',

          '& td + td': {
            borderLeft: 'solid 1px #ffffff80',
            borderCollapse: 'collapse',
          },

          '& tr + tr': {
            borderTop: 'solid 1px #ffffff80',
            borderCollapse: 'collapse',
          },

          '& td': {
            minHeight: '200px !important',
          }
        }}
      >
        <tbody>
          <tr>
            <td>
              <StatBox title="Flagged posts" value={data ? data.num_posts : '?'}/>
            </td>
            <td>
              <StatBox title="Flagged users" value={data ? data.num_users : '?'}/>
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>
  )
}
