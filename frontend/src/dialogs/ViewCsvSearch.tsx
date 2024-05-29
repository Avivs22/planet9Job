import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Typography, Box, Fade } from "@mui/material";
import { CheckCircleOutline, ErrorOutlineRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import Papa from "papaparse";

import "react-toastify/dist/ReactToastify.css";
import "./style.css";

import CloseButton from "../components/CloseButton";
import { ProgressBar } from "../components/ProgressBar";
import AtomicSpinner from "atomic-spinner";

export interface ViewCsvSearchDialogProps {
  search: (urls: any) => void;
  open: boolean;
  onClose: () => void;
  file: File | undefined;
}

const DEFAULT_ERROR_MESSAGE =
  "Oh No. Something terrible happened... Please try again or contact admin";
const CSV_FORMAT_ERROR_MESSAGE =
  "The CSV file is either empty or not in the right format. Correct format: URL, url_source columns";

export function ViewCsvSearchDialog({
  search,
  open,
  onClose,
  file,
}: ViewCsvSearchDialogProps) {
  const [searchStatus, setSearchStatus] = useState("idle"); // 'idle', 'processing', 'loading', 'success', 'error'
  const [progress, setProgress] = useState(0);
  const [closeCountdown, setCloseCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE);
  const shouldAbortRef = useRef(false);

  const onCloseDialog = () => {
    shouldAbortRef.current = true;
  };

  const handleExited = () => {
    onClose();
  };

  const parseCSV = () => {
    if (!file) return;
    setSearchStatus("loading");
    let filteredUrls: any[] = [];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: (result, parser) => {
        if (shouldAbortRef.current) parser.abort();
        const { URL, url_source } = result.data;
        parser.pause();
        setTimeout(() => {
          filteredUrls.push({ URL, url_source });
          setProgress((prevProgress) => prevProgress + 1);
          parser.resume();
        }, 10);
      },
      complete: () => {
        if (!shouldAbortRef.current) {
          handleComplete(filteredUrls);
        }
      },
      error: handleError,
    });
  };

  useEffect(() => {
    if (open && file) {
      parseCSV();
    }
  }, [open, file]);

  const handleComplete = async (filteredUrls: any[]) => {
    if (filteredUrls.length === 0) {
      setErrorMessage(CSV_FORMAT_ERROR_MESSAGE);
      setSearchStatus("error");
      return;
    }

    try {
      setSearchStatus("sending");
      await search(filteredUrls);
      setSearchStatus("success");
      startCloseCountdown();
    } catch (error) {
      console.error("Error during search:", error);
      setSearchStatus("error");
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    setErrorMessage(DEFAULT_ERROR_MESSAGE);
    setSearchStatus("error");
  };

  const startCloseCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCloseCountdown((currentCount) => {
        if (currentCount <= 1) {
          clearInterval(countdownInterval);
          onCloseDialog();
          return 0;
        }
        return currentCount - 1;
      });
    }, 1000);
  };

  return (
    <>
      <Dialog
        open={open && !shouldAbortRef.current}
        transitionDuration={{ enter: 500, exit: 500 }}
        TransitionProps={{ onExited: handleExited }}
        maxWidth="xl"
        fullWidth
        sx={{
          "& div.MuiPaper-root": {
            border: 0,
            height: "30%",
          },
        }}
      >
        <Box
          sx={{
            m: 0,
            p: 3,
            px: 6,
            borderRadius: "16px",
            position: "relative",
            background: "linear-gradient(#343d49 0%, #336497 100%)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CloseButton onClick={onCloseDialog} />
          {(searchStatus === "loading" || searchStatus === "sending") && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                key={searchStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {searchStatus === "loading"
                    ? "Processing URLs..."
                    : "Initiating inference process ..."}
                </Typography>
                <ProgressBar
                  proggressedItemsSoFarAmount={progress}
                  placeHolderText="Loading"
                ></ProgressBar>
              </motion.div>
            </Box>
          )}
          {searchStatus === "success" && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircleOutline
                  sx={{
                    color: "primary.main",
                    fontSize: 60,
                    display: "block",
                    margin: "auto",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Inferencing process initiated successfully. Closing dialog in{" "}
                  {closeCountdown}
                </Typography>
              </motion.div>
            </Box>
          )}
          {searchStatus === "error" && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ErrorOutlineRounded
                  sx={{
                    color: "primary.main",
                    fontSize: 60,
                    display: "block",
                    margin: "auto",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              </motion.div>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
}
