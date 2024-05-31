import {
  Box,
  CircularProgress,
  Pagination,
  PaginationItem,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { ReactNode } from "react";
import { format } from "date-fns";
import ClassificationChip from "../ClassificationChip.tsx";
import { Classification } from "../../common/types.ts";

import './styles.css';


export type LinkClickHandler = (row: any, link: string) => void;


export enum SimpleTableModelInferenceColumnType {
  TEXT = 'text',
  DATE = 'date',
  DATE_NO_TIME = 'date_no_time',
  CLASSIFICATION = 'classification',
  LINK = 'view'
}


export interface SimpleTableModelInferenceColumn {
  key: string;
  label: string;
  type?: SimpleTableModelInferenceColumnType;
  render?: (value: any, row: any) => ReactNode;
  hideHeader?: boolean;
  sx?: SxProps;
}


interface SimpleTableModelInferenceRowProps {
  columns: SimpleTableModelInferenceColumn[];
  row: any;
  onClickLink?: LinkClickHandler;
}

interface SimpleTableModelInferenceCellProps {
  row: any;
  column: SimpleTableModelInferenceColumn;
  value: any;
  onClickLink?: LinkClickHandler;
}

function SimpleTableModelInferenceCellContents(props: SimpleTableModelInferenceCellProps) {
  switch (props.column.type) {
    case SimpleTableModelInferenceColumnType.DATE: {
      if (!props.value)
        return <></>;

      const date = new Date(props.value);
      return (
        <>
          <b>{format(date, 'eeee')}</b>, {format(date, 'd LLLL yyyy')}
        </>
      );
    }

    case SimpleTableModelInferenceColumnType.DATE_NO_TIME: {
      const date = new Date(props.value + 'T00:00:00.000000');
      return (
        <>
          <b>{format(date, 'eeee')}</b>, {format(date, 'd LLLL yyyy')}
        </>
      );
    }

    case SimpleTableModelInferenceColumnType.CLASSIFICATION:
      return (<Box sx={props.column.sx}>
        <ClassificationChip value={props.value as Classification} />
      </Box>)

    case SimpleTableModelInferenceColumnType.LINK:
      return (
        <Typography
          variant="body2"
          sx={{ color: '#75B3FF', cursor: 'pointer' }}
          onClick={() => props.onClickLink?.(props.row, props.column.key)}
        >
          {props.value ?? props.column.label}
        </Typography>
      );

    case SimpleTableModelInferenceColumnType.TEXT:
    default:
      return (props.value || '').toString();
  }
}

function SimpleTableModelInferenceRow(props: SimpleTableModelInferenceRowProps) {
  return (
    <TableRow>
      {props.columns.map((column, i) => {
        const value = props.row[column.key];

        return (
          <TableCell key={i}>
            {column.render ? column.render(value, props.row) : (
              <SimpleTableModelInferenceCellContents
                row={props.row}
                column={column}
                value={value}
                onClickLink={props.onClickLink}
              />
            )}
          </TableCell>
        )
      })}
    </TableRow>
  );
}


export interface SimpleTableModelInferenceProps {
  columns: SimpleTableModelInferenceColumn[];
  loading?: boolean;
  data?: any[];
  total?: number;
  pageSize?: number;
  page?: number;
  onChangePage?: (index: number) => void;
  onClickLink?: LinkClickHandler;
  spans?: string[];
}

export function SimpleTableModelInference(props: SimpleTableModelInferenceProps) {
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box sx={{ overflow: 'auto', height: '90%',borderRadius: '6px'}}>

        <Table
          size="small"
        >

          {props.spans && (
            <colgroup>
              {props.spans.map((span, i) => (
                <col key={i} style={{ width: span, maxWidth: span }} />
              ))}
            </colgroup>
          )}

          <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(117, 179, 255, 0.19) !important',backdropFilter: 'blur(20px) !important',borderTopLeftRadius:'6px',borderTopRightRadius:'6px', position: 'sticky', top: 0, zIndex: 1 }}>
              {props.columns.map((column, i) => (
                <TableCell key={i} sx={column.sx}
                >
                  {!column.hideHeader ? column.label : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            className={props.loading ? 'table-loading' : ''}
            sx={{
              transition: 'filter 0.1s ease-in-out',
            }}
          >
            {props.data && props.data.map((row, i) => (
              <SimpleTableModelInferenceRow
                key={row?.id ?? i}
                row={row}
                columns={props.columns}
                onClickLink={props.onClickLink}
              />
            ))}
          </TableBody>

        </Table>

        {props.loading && (
          <>
            <Box
              sx={{
                minHeight: props.data && props.data.length > 0 ? 0 : 100,
              }}
            />

            <CircularProgress
              sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </>
        )}

        {props.data === undefined && (<CircularProgress sx={{ display: 'table', mx: 'auto', my: 3 }} />)}
      </Box>

      {props.total !== undefined && props.pageSize !== undefined && props.page !== undefined && (
        <Stack direction="row" justifyContent="center" sx={{ my: 2 }}>
          <Pagination
            count={Math.ceil(props.total / props.pageSize)}
            page={props.page + 1}
            onChange={(_, v) => v && props.onChangePage?.(v - 1)}
            variant="text"
            renderItem={(item) => (
              <PaginationItem {...item} />
            )}
          />
        </Stack>
      )}
    </Box>
  );
}

