import {

    MenuItem, Select,
    FormControl, SelectChangeEvent, ThemeProvider, Tooltip, Theme, Typography, IconButton,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { CircularProgress } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Papa from 'papaparse'; 

import { convertStrToMilliseconds } from "../common/utils.ts";




export interface DataGridColumn<T> {
    key: keyof T;
    header: string;
    cell?: (cell: MRT_RowData) => ReactNode;
    size?:number;
}

export interface DataGridProps<T> {
    title: string;
    refreshRates?: DataGridRefreshRate[];
    theme: Theme;
    columns: DataGridColumn<T>[];
    handleIntervalChange?: () => void
    data?: T[]
    isLoading: boolean
}
export interface DataGridRefreshRate {
    value: string;
    isDefault?: boolean;
}

export default function DataGrid<T extends MRT_RowData>({ theme, columns, data, refreshRates, isLoading, title }: DataGridProps<T>) {
    const sortedRates = refreshRates?.map(refreshRate => ({
        refreshRateInMilliseconds: convertStrToMilliseconds(refreshRate.value),
        refreshRateAsStr: refreshRate.value,
        isDefault: refreshRate.isDefault
    })).sort((a, b) => a.refreshRateInMilliseconds - b.refreshRateInMilliseconds) || [];

    const [refreshInterval, setRefreshInterval] = useState<number | undefined>(
        sortedRates.length > 0 ? (sortedRates.find(rate => rate.isDefault)?.refreshRateInMilliseconds || sortedRates[0].refreshRateInMilliseconds) : undefined
    );

    const DataGridColumns: MRT_ColumnDef<T>[] = columns.map(c => ({ accessorKey: c.key, header: c.header,Cell:c.cell,grow: true,size:c.size            }));

    const handleIntervalChange = (event: SelectChangeEvent<number>) => {
        setRefreshInterval(event.target.value as number);
    };

    const handleDownload = () => {
        if (!data || data.length === 0) return;

        const csvData = Papa.unparse(data, {
            columns: columns.map(col => col.key as string),
            header: true
        });

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <ThemeProvider theme={theme}>
            <MaterialReactTable
            layoutMode="grid"
                columns={DataGridColumns}
                data={data ?? []}
                state={{ isLoading: isLoading && !data }}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                renderBottomToolbarCustomActions={
                    (props: { table: MRT_TableInstance<T> }) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={handleDownload} size="small" sx={{ cursor: 'pointer',mr:2,ml:1 }}>
                            <FileDownloadOutlinedIcon />
                        </IconButton>
                        {refreshRates && refreshRates.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title="Refresh rate" placement="top" >
                                        <FormControl size="small" sx={{ minWidth: 70, alignSelf: 'center' }}>
                                            <Select
                                                labelId="interval-select-label"
                                                id="interval-select"
                                                value={refreshInterval}
                                                onChange={handleIntervalChange}
                                                size="small"
                                                sx={{ '.MuiSelect-select': { fontSize: '80%' } }}
                                            >
                                                {sortedRates.map((rate, index) => (
                                                    <MenuItem key={index} value={rate.refreshRateInMilliseconds}>
                                                        {rate.refreshRateAsStr}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Tooltip>
                                    {(isLoading && data) && <CircularProgress size={15} color="inherit" sx={{ ml: 1, alignSelf: "center" }} />}
                                </div>
                            )}
                        </div>)
                }
                renderTopToolbarCustomActions={(props: { table: MRT_TableInstance<T> }) => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6">{title}</Typography>

                    </div>
                )}
            />
        </ThemeProvider>
    );
};