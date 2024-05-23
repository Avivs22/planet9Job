import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  ArrowBack,
  ArrowForward,
  ArrowLeft,
  Close,
} from "@mui/icons-material";
import { useGetSDBItemQuery } from "../common/api.ts";
import { SocialMediaKindIconWithText } from "../components/SocialMediaKind.tsx";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ItemSnapshot } from "../components/ItemSnapshot";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Avatar } from "../components/Avatar.tsx";
import { AnalystInfo, SocialMediaItem } from "../common/types.ts";

interface AddSDBCommentParams {
  uuid: string;
  text: string;
}

interface AddSDBCommentResponse {}

function useAddSDBCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation<AddSDBCommentResponse, unknown, AddSDBCommentParams>({
    mutationFn: async (params: AddSDBCommentParams) => {
      return (await axios.post("/api/sdb/add-comment", params))
        .data as AddSDBCommentResponse;
    },
    onSuccess() {
      queryClient.invalidateQueries("sdb-item").then();
    },
  });
}

interface CommentBoxProps {
  text: string;
  timestamp: number;
  analyst: AnalystInfo;
}

function CommentBox(props: CommentBoxProps) {
  return (
    <Card sx={{ p: 1.5 }}>
      <Stack direction="row" spacing={2}>
        <Avatar
          noName
          orientation="vertical"
          size={48}
          analyst={props.analyst}
        />

        <Stack spacing={1}>
          <Typography>{props.text}</Typography>

          <Typography
            fontFamily="Helvetica Medium"
            variant="body2"
            sx={{ color: "#ffffff90" }}
          >
            {format(new Date(props.timestamp * 1000), "MMM d, HH:mm a")}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

interface AddCommentBoxProps {
  itemId: string;
}

function AddCommentBox(props: AddCommentBoxProps) {
  const [value, setValue] = useState("");

  const addComment = useAddSDBCommentMutation();
  const loading = addComment.isLoading;

  const handlePost = async () => {
    await addComment.mutateAsync({
      uuid: props.itemId,
      text: value,
    });

    setValue("");
  };

  return (
    <Card sx={{ p: 1.5, px: 3 }}>
      <TextField
        fullWidth
        multiline
        variant="standard"
        InputProps={{ disableUnderline: true }}
        placeholder="Comment here"
        sx={{ height: 150 }}
        disabled={loading}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // disable growth
        inputProps={{ style: { height: 150 } }}
      />

      <Button
        size="small"
        variant="contained"
        sx={{
          mt: 2,
          color: "white",
          textTransform: "none",
          borderRadius: "16px",
          display: "table",
          marginLeft: "auto",
        }}
        disabled={loading}
        onClick={handlePost}
      >
        {loading ? "Posting..." : "Post"}
        {loading && <CircularProgress size={10} sx={{ ml: 1 }} />}
      </Button>
    </Card>
  );
}

export interface ItemPagingInfo {
  pageItems: SocialMediaItem[];
  pageNumber: number;
  localIndex: number;
  globalIndex: number;
  total: number;
}

export interface ViewSocialMediaItemDialogProps {
  uuid?: string;
  open: boolean;
  onClose: () => void;
  paging?: ItemPagingInfo;
}

export function ViewSocialMediaItemDialog(
  props: ViewSocialMediaItemDialogProps,
) {
  const [uuid, setUuid] = useState<string | undefined>(props.uuid);
  const [paging, setPaging] = useState<ItemPagingInfo | undefined>(
    props.paging,
  );
  useEffect(() => {
    setUuid(props.uuid);
    setPaging(props.paging);
  }, [props.uuid, props.paging]);

  const { data, isLoading } = useGetSDBItemQuery({
    uuid,
  });

  console.log("P", paging);

  const uploadDate = useMemo(
    () => (data?.item?.added_at ? new Date(data.item.added_at * 1000) : 0),
    [data?.item?.added_at],
  );

  const handleBack = () => {
    if (!paging) return;

    if (paging.localIndex > 0) {
      setUuid(paging.pageItems[paging.localIndex - 1].uuid);
      setPaging({
        ...paging,
        localIndex: paging.localIndex - 1,
        globalIndex: paging.globalIndex - 1,
      });
    }
  };

  const handleForward = () => {
    if (!paging) return;

    if (paging.localIndex + 1 < paging.pageItems.length) {
      setUuid(paging.pageItems[paging.localIndex + 1].uuid);
      setPaging({
        ...paging,
        localIndex: paging.localIndex + 1,
        globalIndex: paging.globalIndex + 1,
      });
    }
  };

  return (
    <Dialog
      open={Boolean(props.uuid && props.open)}
      onClose={props.onClose}
      maxWidth={isLoading ? "xs" : "xl"}
      fullWidth
      sx={{
        "& div.MuiPaper-root": {
          border: 0,
        },
      }}
    >
      <Box
        sx={{
          m: 0,
          p: 3,
          px: 6,
          background: "linear-gradient(#343d49 0%, #336497 100%)",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={props.onClose}
        >
          <Close />
        </IconButton>

        {isLoading && (
          <CircularProgress sx={{ display: "table", mx: "auto", my: 3 }} />
        )}

        {data?.item && (
          <Grid container spacing={6} sx={{ position: "relative" }}>
            <Grid item xs={7}>
              <Stack
                sx={{ height: "100%", overflow: "auto", userSelect: "none" }}
                justifyContent="center"
                alignItems="center"
              >
                <ItemSnapshot
                  item={data.item}
                  scraper={data.scraper ?? undefined}
                />
              </Stack>
            </Grid>

            <Grid item xs={5}>
              <Box
                sx={{
                  width: "0px !important",
                  height: props.paging
                    ? "calc(100% - 80px)"
                    : "calc(100% - 48px)",
                  position: "absolute",
                  borderLeft: "solid 1px #ffffff33",
                  ml: -3,
                }}
              />

              <Typography fontFamily="Helvetica Medium" variant="h6">
                General info:
              </Typography>

              <Stack
                direction="row"
                sx={{ mt: 3 }}
                spacing={2}
                alignItems="center"
              >
                <SocialMediaKindIconWithText kind={data.item.kind} size={36} />

                <Box
                  sx={{
                    width: 0,
                    height: 56,
                    borderLeft: "solid 1px #ffffff33",
                  }}
                />

                <Avatar
                  orientation="vertical"
                  size={42}
                  analyst={data.item.analyst}
                />

                {/*<Stack alignItems="center">*/}
                {/*  <AccountCircle sx={{color: 'white', width: 42, height: 42}}/>*/}
                {/*  <Typography>You</Typography>*/}
                {/*</Stack>*/}

                <Box sx={{ flex: 1 }} />

                <Box>
                  {uploadDate && (
                    <Typography fontFamily="Helvetica Medium">
                      Upload date:
                      <Typography component="span" sx={{ ml: 1 }}>
                        {format(uploadDate, "MMMM dd yyyy")}{" "}
                        <b>{format(uploadDate, "HH:mm")}</b>
                      </Typography>
                    </Typography>
                  )}

                  <Typography fontFamily="Helvetica Medium">
                    Username:
                    <Typography
                      component="span"
                      sx={{ ml: 1, color: "#01a1fd" }}
                    >
                      {data.item.user}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 7 }}
              >
                <Typography fontFamily="Helvetica Medium" variant="h6">
                  Cases:
                </Typography>

                {data.item.cases.map((c) => (
                  <Chip
                    key={c.uuid}
                    label={c.name}
                    sx={{ bgcolor: "#01a1fd" }}
                  />
                ))}
              </Stack>

              <Stack
                sx={{
                  mt: 3,
                  transition: "filter 0.25s ease",
                  filter: isLoading ? "blur(5px)" : "none",
                }}
                spacing={3}
              >
                {data.comments.map((c) => (
                  <CommentBox
                    key={c.uuid}
                    text={c.text}
                    timestamp={c.added_at}
                    analyst={c.analyst}
                  />
                ))}

                <AddCommentBox itemId={data.item.uuid} />
              </Stack>
            </Grid>

            {paging && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  disabled={paging.globalIndex === 0}
                  onClick={handleBack}
                >
                  <ArrowBack />
                </IconButton>

                <IconButton
                  disabled={paging.globalIndex + 1 >= paging.total}
                  onClick={handleForward}
                >
                  <ArrowForward />
                </IconButton>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Dialog>
  );
}
