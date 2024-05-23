import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography
} from "@mui/material";
import {Add, CheckBox, CheckBoxOutlineBlank, MoreVert} from "@mui/icons-material";
import React, {useEffect, useMemo, useState} from "react";
import {SearchTextField} from "../../components/SearchCard.tsx";
import {useListCasesQuery, useListSDBItemsQuery} from "../../common/api.ts";
import {AnalystInfo, Case, Priority, SocialMediaItem, SocialMediaKind} from "../../common/types.ts";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {SimpleTableCard, SimpleTableColumn} from "../../components/SimpleTable";
import {format} from 'date-fns';
import PriorityChip from "../../components/PriorityChip.tsx";
import {ItemPagingInfo, ViewSocialMediaItemDialog} from "../../dialogs/ViewSocialMediaItem.tsx";
import {SocialMediaKindIcon, SocialMediaKindText} from "../../components/SocialMediaKind.tsx";
import {useSnackbar} from "notistack";
import {Avatar} from "../../components/Avatar.tsx";
import {isWaitingStatus} from "../../common/utils.ts";

const uncheckedIcon = <CheckBoxOutlineBlank fontSize="small"/>;
const checkedIcon = <CheckBox fontSize="small"/>;


interface CaseAutocompleteProps {
  value: Case[];
  onChange: (value: Case[]) => void;
  disabled?: boolean;
}

function CaseAutocomplete(props: CaseAutocompleteProps) {
  const {data, isLoading} = useListCasesQuery({});

  const options = useMemo(() => {
    if (!data)
      return [];

    return data.items;
  }, [data]);

  return (
    <Autocomplete
      multiple
      value={props.value}
      onChange={(_e, newValue) => props.onChange(newValue)}
      fullWidth
      options={options}
      loading={isLoading}
      disabled={props.disabled}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, {selected}) => (
        <li {...props}>
          <Checkbox
            icon={uncheckedIcon}
            checkedIcon={checkedIcon}
            style={{marginRight: 8}}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <SearchTextField
          {...params}
          placeholder="Add a case here..."
          fullWidth
        />
      )}
    />
  )
}


interface AddSDBItemParams {
  url: string;
  comment: string;
  case_uuids: string[];
}

interface AddSDBItemResponse {
}

function useAddSDBItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<AddSDBItemResponse, unknown, AddSDBItemParams>({
    mutationFn: async (params: AddSDBItemParams) => {
      return (await axios.post('/api/sdb/add', params)).data as AddSDBItemResponse;
    },
    onSuccess() {
      queryClient.invalidateQueries('list-sdb-items').then();
    }
  });
}

function CreateCard() {
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const [cases, setCases] = useState<Case[]>([]);

  const {enqueueSnackbar} = useSnackbar();

  const [isError, setIsError] = useState(false);

  const addItem = useAddSDBItemMutation();
  const loading = addItem.isLoading;
  const handleAdd = async () => {
    try {
      await addItem.mutateAsync({
        url,
        comment,
        case_uuids: cases.map(c => c.uuid),
      });
    } catch (e) {
      let message = 'Failed to add item to database';
      switch (e?.response?.data?.detail) {
        case 'invalid url':
          message = 'Unsupported URL format, try adding a URL of one of the supported platforms';
          break;
      }

      setIsError(true);
      enqueueSnackbar(message, {variant: 'error'});
      return;
    }

    enqueueSnackbar('Added item to database', {variant: 'success'});

    setUrl('');
    setComment('');
    setCases([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleAdd().then();
    }
  }


  return (
    <Card
      sx={{
        p: 3,
        border: 'solid 2px #777',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SearchTextField
            placeholder="Add URL of: post, user, website..."
            fullWidth
            autoFocus
            value={url}
            disabled={loading}
            error={isError}
            onChange={e => {
              setIsError(false);
              setUrl(e.target.value)
            }}
            onKeyPress={handleKeyPress}
            InputProps={{
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <Search sx={{width: 24,}}/>
              //   </InputAdornment>
              // ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    // onClick={() => props.onSearch(value)}
                    sx={{
                      backgroundColor: '#ffffffcc',
                      textTransform: 'none',
                      color: 'black',
                      borderRadius: '16px',
                      pr: 2,

                      '&:hover': {
                        backgroundColor: '#ffffffdd',
                      },

                      '&:disabled': {
                        color: 'gray',
                      },
                      '&:disabled svg': {
                        color: 'gray !important',
                      },
                    }}
                    startIcon={<Add sx={{color: 'black !important'}}/>}
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading ? "Adding to DB..." : "Add to DB"}
                    {loading && <CircularProgress size={16} sx={{ml: 1}}/>}
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SearchTextField
            placeholder="Add a comment here..."
            fullWidth
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CaseAutocomplete
            value={cases}
            onChange={setCases}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Card>
  );
}


const BASE_TABLE_COLUMNS: SimpleTableColumn[] = [
  {
    key: 'kind',
    label: '',
    render: (kind: null | SocialMediaKind, row: SocialMediaItem) => {
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          <SocialMediaKindIcon kind={kind as SocialMediaKind}/>
          {isWaitingStatus(row.status) && <CircularProgress size={16}/>}
        </Stack>
      );
    }
  },
  {
    key: 'kind',
    label: 'Item',
    render: (kind: null | string) => {
      return (
        <SocialMediaKindText
          kind={kind as SocialMediaKind}
          sx={{fontFamily: 'Helvetica Medium'}}
        />
      )
    },
  },
  {
    key: 'user',
    label: 'User',
    render: (value: null | string, row: SocialMediaItem) => {
      if (!value && isWaitingStatus(row.status)) {
        return <CircularProgress size={16} sx={{mb: '-4px'}}/>;
      }

      return (
        <Typography fontWeight="bold" sx={{color: '#75b3ff'}}>
          {value}
        </Typography>
      );
    },
  },
  {
    key: 'added_at',
    label: 'Added date',
    render: (value: number) => {
      const d = new Date(value * 1000);

      return (
        <Typography>{format(d, 'MMMM dd yyyy')} <b>{format(d, 'HH:mm')}</b></Typography>
      );
    },
  },
  {
    key: 'analyst',
    label: 'Added by',
    render: (analyst: AnalystInfo) => {
      return (
        <Avatar orientation="horizontal" analyst={analyst}/>
      );
    },
  },
  {
    key: 'cases',
    label: 'Case',
    render: (cases: Case[]) => {
      const mainCase = cases.length > 0 ? cases[0].name : null;

      return (
        <Typography sx={{color: '#b0b0b0'}}>
          {mainCase}
        </Typography>
      );
    },
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (priority: Priority) => {
      return (
        <PriorityChip value={priority}/>
      );
    },
  },
];


const TABLE_SPANS = ['0px'];


function SDBItemTableCard() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const {data, isLoading} = useListSDBItemsQuery({
    page,
    page_size: pageSize,
  }, {
    refetchWhilePending: true,
  });

  const [items, setItems] = useState<SocialMediaItem[]>([]);
  const [total, setTotal] = useState<undefined | number>(undefined);
  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
      setTotal(data.total);
    }
  }, [data?.items, data?.total]);

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewId, setViewId] = useState<null | string>(null);

  const pagingContext = useMemo<undefined | ItemPagingInfo>(() => {
    if (!viewId || !data?.items)
      return undefined;

    const localIndex = data.items.findIndex(i => i.uuid === viewId);
    if (localIndex === -1)
      return undefined;

    return {
      pageItems: data.items,
      total: data.total,
      pageNumber: page,
      localIndex,
      globalIndex: page * pageSize + localIndex,
    };
  }, [page, pageSize, viewId, data]);

  const columns = useMemo(() => {
    return [
      ...BASE_TABLE_COLUMNS,
      {
        key: 'uuid',
        label: 'Screenshot',
        render: (uuid: string, row: SocialMediaItem) => {
          const disabled = isWaitingStatus(row.status);
          return (
            <Typography
              sx={{
                color: disabled ? '#999' : '#75b3ff',
                userSelect: 'none',
                cursor: disabled ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (!disabled) {
                  setViewId(uuid);
                  setShowViewDialog(true);
                }
              }}
            >
              View
            </Typography>
          );
        }
      },
      {
        key: 'url',
        label: 'Link',
        render: (url: string) => {
          if (!url.startsWith('http://') && !url.startsWith('https://'))
            url = 'http://' + url;

          return (
            <Typography
              component="a"
              href={url}
              target="_blank"
              sx={{color: '#75b3ff', textDecoration: 'underline'}}
            >
              Link
            </Typography>
          );
        },
      },
      {
        key: '_action',
        label: '',
        render: (_value: null | string) => {
          return (
            <IconButton disabled>
              <MoreVert sx={{color: 0x5b5b5b}}/>
            </IconButton>
          )
        }
      }
    ];
  }, [setViewId, setShowViewDialog]);

  const handleChangePage = (index: number) => {
    setPage(index);
  }

  return (
    <>
      <ViewSocialMediaItemDialog
        uuid={viewId ?? undefined}
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        paging={pagingContext}
      />

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
    </>
  )
}


export function SocialMediaDatabasePage() {
  return (
    <Box sx={{p: 5}}>
      <Typography variant="h4">
        Social media database
      </Typography>

      <Grid container sx={{mt: 1}} spacing={3}>
        <Grid item xs={12}>
          <CreateCard/>
        </Grid>

        <Grid item xs={12}>
          <SDBItemTableCard/>
        </Grid>
      </Grid>
    </Box>
  )
}