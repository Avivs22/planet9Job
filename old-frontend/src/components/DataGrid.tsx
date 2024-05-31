import {

    MenuItem, Select,
    FormControl, SelectChangeEvent, ThemeProvider, Tooltip, Theme,
} from "@mui/material";
import { useState } from "react";
import { MaterialReactTable, MRT_ColumnDef, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { CircularProgress } from '@mui/material';

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
};


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
    isLoading:boolean
}
export interface DataGridRefreshRate {
    value: string;
    isDefault?: boolean;
}

export default function DataGrid<T extends MRT_RowData>({ theme, columns, data, refreshRates,isLoading }: DataGridProps<T>) {
    const sortedRates = refreshRates?.map(refreshRate => ({
        refreshRateInMilliseconds: convertStrToMilliseconds(refreshRate.value),
        refreshRateAsStr: refreshRate.value,
        isDefault: refreshRate.isDefault
    })).sort((a, b) => a.refreshRateInMilliseconds - b.refreshRateInMilliseconds) || [];

    const [refreshInterval, setRefreshInterval] = useState<number | undefined>(
        sortedRates.length > 0 ? (sortedRates.find(rate => rate.isDefault)?.refreshRateInMilliseconds || sortedRates[0].refreshRateInMilliseconds) : undefined
    );

    const DataGridColumns: MRT_ColumnDef<T>[] = columns.map(c => ({ accessorKey: c.key, header: c.header }));

    const handleIntervalChange = (event: SelectChangeEvent<number>) => {
        setRefreshInterval(event.target.value as number);
    };

    return (
        <ThemeProvider theme={theme}>
            <MaterialReactTable
                columns={DataGridColumns}
                data={data ?? []}
                state={{isLoading:isLoading && !data}}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                renderTopToolbarCustomActions={(props: { table: MRT_TableInstance<T> }) => (

                    refreshRates && refreshRates.length > 0 &&(
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Tooltip title="Refresh rate" enterDelay={500} leaveDelay={200}>
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
                                    <MenuItem key={index} value={rate.refreshRateInMilliseconds}>{rate.refreshRateAsStr}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Tooltip>
                    {( isLoading && data) && <CircularProgress size={15} color="inherit" sx={{ml:1, alignSelf:"center"}}/>}
                    </div>
                    )                             
                )}
                
            />
        </ThemeProvider>
    );
}