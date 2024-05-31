import {Box, Grid, Stack, Typography} from "@mui/material";
import {SearchCard} from "../../components/SearchCard.tsx";
import {SimpleTableCard, SimpleTableColumn, SimpleTableColumnType} from "../../components/SimpleTable";
import {useQuery} from "react-query";
import axios from "axios";
import {useCallback, useEffect, useMemo, useState} from "react";
import {atom, useAtomValue, useSetAtom} from "jotai";
import {useNavigate} from "react-router-dom";
import {autoInvestigateUrlAtom} from "../../state/ui.ts";


const searchQueryAtom = atom('');


function DatabaseSearchCard() {
  const updateSearchQuery = useSetAtom(searchQueryAtom);
  const handleSearch = (value: string) => {
    updateSearchQuery(value);
  };

  return (
    <SearchCard
      onSearch={handleSearch}
      placeholder="Search URL, keyword..."
    />
  )
}


interface DatabaseItem {
  uuid: string;
  url: string;
  classification: string;
  score: number;
  ip: string;
}

interface GetDatabaseItemsParams {
  query: string;
  page: number;
  page_size: number;
}

interface GetDatabaseItemsResponse {
  total: number;
  items: DatabaseItem[];
}

function useGetDatabaseItemsQuery(params: GetDatabaseItemsParams) {
  return useQuery(['database-items', params], async () => {
    return (await axios.get('/api/database_items', {params})).data as GetDatabaseItemsResponse;
  });
}

const BASE_DATABASE_TABLE_COLUMNS: SimpleTableColumn[] = [
  {
    key: 'url',
    label: 'URL',
    // type: SimpleTableColumnType.TEXT,
    render: (value: string) => {
      return (
        <Typography
          variant="body2"
          fontFamily="Helvetica Medium"
          fontSize={theme => theme.typography.fontSize * 1.1}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 650,
          }}
        >
          {value}
        </Typography>
      );
    }
  },
  {
    key: 'classification',
    label: 'Classification',
    type: SimpleTableColumnType.CLASSIFICATION,
  },
  {
    key: 'score',
    label: 'Score',
    type: SimpleTableColumnType.TEXT,
  },
  {
    key: 'ip',
    label: 'IP',
    type: SimpleTableColumnType.TEXT,
  },
];

const TABLE_SPANS = ['50%', '10%', '10%', '10%', '20%'];

function DatabaseTableCard() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const searchQuery = useAtomValue(searchQueryAtom);
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const {data, isLoading} = useGetDatabaseItemsQuery({
    query: searchQuery,
    page,
    page_size: pageSize,
  });

  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [total, setTotal] = useState<undefined | number>(undefined);
  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
      setTotal(data.total);
    }
  }, [data?.items, data?.total]);

  const navigate = useNavigate();
  const updateAutoInvestigateUrl = useSetAtom(autoInvestigateUrlAtom);
  const handleView = useCallback((item: DatabaseItem) => {
    updateAutoInvestigateUrl(item.url);
    navigate('/dashboard/url/investigate?url=' + encodeURIComponent(item.url));
  }, [navigate, updateAutoInvestigateUrl]);

  const columns = useMemo(() => {
    return [
      ...BASE_DATABASE_TABLE_COLUMNS,
      {
        key: 'actions',
        label: '',
        render: (_, row: DatabaseItem) => {
          return (
            <Stack direction="row" spacing={5} alignItems="center">
              <Typography
                color="#75b3ff"
                variant="body2"
                onClick={() => handleView(row)}
                sx={{cursor: 'pointer', userSelect: 'none'}}
              >
                View
              </Typography>

              {/*<Typography variant="body2" sx={{textDecoration: 'underline'}}>*/}
              {/*  Save*/}
              {/*</Typography>*/}

              {/*<IconButton disabled>*/}
              {/*  <MoreVert sx={{ color: '#e4e3e366' }} />*/}
              {/*</IconButton>*/}
            </Stack>
          );
        },
      }
    ];
  }, [handleView]);

  const handleChangePage = (index: number) => {
    setPage(index);
  }

  return (
    <SimpleTableCard
      title="Database items"
      columns={columns}
      data={items}
      loading={isLoading}
      page={page}
      pageSize={pageSize}
      total={total}
      spans={TABLE_SPANS}
      onChangePage={handleChangePage}
    />
  )
}


export default function DatabasePage() {
  return (
    <Box sx={{m: 5}}>
      <Typography variant="h4">
        Database
      </Typography>

      <Grid container sx={{mt: 1, position: 'relative'}} spacing={3}>
        <Grid item xs={12}>
          <DatabaseSearchCard/>
        </Grid>

        <Grid item xs={12}>
          <DatabaseTableCard/>
        </Grid>
      </Grid>
    </Box>
  );
}

