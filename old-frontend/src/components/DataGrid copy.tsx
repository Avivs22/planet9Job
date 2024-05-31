import {

    MenuItem, Select,
    FormControl, SelectChangeEvent, ThemeProvider, Tooltip, Theme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef, MRT_RowData, MRT_TableInstance } from 'material-react-table';


export interface DataGridColumn<T> {
    key: keyof T;
    header: string;
}

export interface DataGridProps<T> {
    refreshRates?: DataGridRefreshRate[];
    theme: Theme;
    columns: DataGridColumn<T>[];
    handleIntervalChange?: () => void
    data?: T[]
}
export interface DataGridRefreshRate {
    value: string;
    isDefault?: boolean;
}

export default function DataGrid<T extends MRT_RowData>({ theme, columns, data, refreshRates }: DataGridProps<T>) {
    // const [refreshInterval, setRefreshInterval] = useState<string | undefined>(refreshRates?.find(refreshRate => refreshRate.isDefault)?.value);
    const [refreshInterval, setRefreshInterval] = useState<number>();

    const DataGridColumns: MRT_ColumnDef<T>[] = columns.map(c => {
        return { accessorKey: c.key, header: c.header }
    })

    const handleIntervalChange = (event: SelectChangeEvent<number>) => {
        console.log(event.target.value)
        setRefreshInterval(event.target.value as number);
    };


    const convertStrToMilliseconds = (input: string): number => {
        const units: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        const match = input.match(/^(\d+)([smhd])$/);
        if (!match) {
            throw new Error("Input format is invalid. Please use the format like '10s', '5m', '2h', or '1d'.");
        }

        const [, value, unit] = match;

        if (!units.hasOwnProperty(unit)) {
            throw new Error(`Unsupported time unit '${unit}'. Only 's' (seconds), 'm' (minutes), 'h' (hours), and 'd' (days) are supported.`);
        }

        return parseInt(value, 10) * units[unit];

    }

    return (
        <ThemeProvider theme={theme} >

            <MaterialReactTable
                columns={DataGridColumns}
                data={data??[]}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                renderTopToolbarCustomActions={(props: { table: MRT_TableInstance<T> }) => (
                    refreshRates && refreshInterval &&
                    <Tooltip title="Refresh rate" enterDelay={500} leaveDelay={200}>
                        <FormControl size="small" sx={{ minWidth: 70, alignSelf: 'center' }} >
                            <Select
                                labelId="interval-select-label"
                                id="interval-select"
                                label="RefreshRate"
                                value={refreshInterval}
                                onChange={handleIntervalChange}
                                size="small"
                                sx={{
                                    '.MuiSelect-select': {
                                        fontSize: '80%',
                                    }
                                }}          >
                                {refreshRates.map(refreshRate => ({
                                    refreshRateInMilliseconds: convertStrToMilliseconds(refreshRate.value),
                                    refreshRateAsStr: refreshRate.value
                                })).sort((a, b) => a.refreshRateInMilliseconds - b.refreshRateInMilliseconds).map((rate, index) => (
                                    <MenuItem key={index} value={rate.refreshRateInMilliseconds}>{rate.refreshRateAsStr}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Tooltip>

                )}
            />
        </ThemeProvider>

    );
};