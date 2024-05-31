import {Box, Card, CircularProgress, Grid, LinearProgress, Stack, Typography} from "@mui/material";
import React, {useCallback, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Case, SocialMediaItem} from "../../common/types.ts";
import {useQuery} from "react-query";
import axios from "axios";
import {MainOverviewCard} from "../SocialMediaDashboard/cards/MainOverview.tsx";
import {useGetSDBItemQuery, useListSDBItemsQuery} from "../../common/api.ts";
import {Masonry} from "@mui/lab";
import {ItemSnapshot} from "../../components/ItemSnapshot";
import {SocialMediaKindIcon} from "../../components/SocialMediaKind.tsx";
import {Avatar} from "../../components/Avatar.tsx";
import { format } from "date-fns";
import { isWaitingStatus } from "../../common/utils.ts";
import {ViewSocialMediaItemDialog} from "../../dialogs/ViewSocialMediaItem.tsx";


export interface GetCaseParams {
  uuid?: string;
}

export interface GetCaseResponse {
  item: null | Case;
}

export function useGetCaseQuery(params: GetCaseParams) {
  return useQuery(['case', params], async () => {
    return (await axios.get('/api/cases/get', {params})).data as GetCaseResponse;
  }, {
    retry: false,
    enabled: !!params.uuid,
  });
}


interface ItemBlockProps {
  item: SocialMediaItem;
  onView: (item: SocialMediaItem) => void;
}

function ItemBlock(props: ItemBlockProps) {
  const {data, isLoading} = useGetSDBItemQuery({uuid: props.item.uuid});

  const date = useMemo(
    () => new Date(props.item.added_at * 1000),
    [props.item]
  );

  const disabled = isWaitingStatus(props.item.status);

  const handleView = () => {
    props.onView(props.item);
  };

  if (isLoading || !data?.scraper) {
    return (
      <Stack
        sx={{height: 200, bgcolor: '#ffffff19', borderRadius: '16px'}}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress/>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        bgcolor: '#ffffff30',
        borderRadius: '8px',
        boxShadow: '0px 0px 8px 0px #00000030',
    }}>
      <div style={{ userSelect: 'none' }}>
        <ItemSnapshot item={props.item} scraper={data?.scraper} noBorder />
      </div>

      <Stack direction="row" sx={{ p: 2, px: 4 }} spacing={2} alignItems="center" justifyContent="space-between">
        <SocialMediaKindIcon kind={props.item.kind} size={40} />

        <Box sx={{ height: '100%', width: '1px', bgcolor: '#ffffff20', }} />

        {date && (
          <>
            <Typography>
              <b>{format(date, 'dd MMM')},</b> {format(date, 'yyyy')}
            </Typography>

            <Box sx={{ height: '100%', width: '1px', bgcolor: '#ffffff20', }} />
          </>
        )}

        <Avatar orientation="vertical" analyst={props.item.analyst} size={36} />

        <Box sx={{ height: '100%', width: '1px', bgcolor: '#ffffff20', }} />

        <Typography
          sx={{
            color: disabled ? '#999' : '#75b3ff',
            userSelect: 'none',
            cursor: disabled ? 'default' : 'pointer',
          }}
          onClick={handleView}
        >
          View
        </Typography>

      </Stack>
    </Stack>
  );
}


interface ItemMasonryProps {
  caseId: string;
}

function ItemMasonry(props: ItemMasonryProps) {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewId, setViewId] = useState<null | string>(null);

  const {data, isLoading} = useListSDBItemsQuery({
    case_uuid: props.caseId,
    page_size: 10,
    page: 0,
  });

  const handleView = useCallback((item: SocialMediaItem) => {
    setViewId(item.uuid);
    setShowViewDialog(true);
  }, []);

  if (isLoading)
    return <LinearProgress sx={{mt: 3}}/>

  return (
    <Card sx={{p: 1.5, px: 3}}>
      <ViewSocialMediaItemDialog
        uuid={viewId ?? undefined}
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
      />

      <Typography variant="h5">
        Items
      </Typography>

      {data && (
        <Masonry columns={3} spacing={3} sx={{mt: 3}}>
          {data.items.map(item => (
            <ItemBlock key={item.uuid} item={item} onView={handleView} />
          ))}
        </Masonry>
      )}
    </Card>
  )
}


export function ViewCasePage() {
  const {caseId} = useParams();
  const {data} = useGetCaseQuery({uuid: caseId});

  return (
    <Box sx={{p: 5}}>
      <Typography variant="h4">
        {data?.item?.name ?? '...'}
      </Typography>

      <Typography
        variant="h6"
        sx={{color: '#75b3ff', textDecoration: 'underline '}}
        component={Link}
        to={-1 as unknown as string}
      >
        Back
      </Typography>

      <Grid container sx={{mt: 3}} spacing={3}>
        <Grid item xs={12}>
          <MainOverviewCard caseId={caseId}/>
        </Grid>

        {caseId && (
          <Grid item xs={12}>
            <ItemMasonry caseId={caseId}/>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}