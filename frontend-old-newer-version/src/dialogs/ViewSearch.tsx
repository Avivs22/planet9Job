import { useEffect, useState } from "react";
import {
  Dialog,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@mui/material";
import { Close, CheckCircleOutline } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import AtomicSpinner from "atomic-spinner";
import "./style.css";
import CloseButton from "../components/CloseButton";

export interface ViewSearchDialogProps {
  search: (url:string) => void;
  open: boolean;
  onClose: () => void;
}
export function ViewSearchDialog(props: ViewSearchDialogProps) {
  const [searchStatus, setSearchStatus] = useState("idle"); // 'idle', 'loading', 'success', 'noResults'
  const [searchResults, setSearchResults] = useState<any>([]);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  useEffect(() => {
    if (props.open) {
      handleSearch("TODO implment correct way to search");
    }
  }, [props.open]);

  const handleSearch = (url: any) => {
    setSearchStatus("loading");
    setTimeout(() => {
      // TODO implement request here to check for exsisting results
      const existingResults = [
        { name: "8237-48234-58234-256354-625", date: "2021-01-01" },
        { name: "9999-48234-58234-256354-12", date: "2021-01-02" },
      ];
      if (existingResults.length > 0) {
        setSearchResults(existingResults);
        setSelectedResult(0);

        setSearchStatus("noResults");
      } else {
        setSearchStatus("noResults");
        // await props.search()
      }
    }, 3000);
  };
  const handleRowClick = (index: number) => {
    setSelectedResult(index);
  };

  const handleChooseClick = () => {
    if (selectedResult !== null) {
      console.log("Chosen result:", searchResults[selectedResult]);
      // TODO implement request here to to load selected result

      props.onClose();
    }
  };
  return (
    <>
      <Dialog
        open={props.open}
        maxWidth="xl"
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
            borderRadius: "16px",
            position: "relative",
            background: "linear-gradient(#343d49 0%, #336497 100%)",
          }}
        >
          <CloseButton onClick={props.onClose} />

          {(searchStatus === "loading" || searchStatus === "noResults") && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AtomicSpinner nucleusSpeed={0.5} />
              </motion.div>
            </Box>
          )}
          {searchStatus === "loading" && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Checking for existing results...
                </Typography>
              </motion.div>
            </Box>
          )}
          {searchStatus === "noResults" && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" sx={{ mt: 2 }}>
                  No prior results. Performing search...
                </Typography>
              </motion.div>
            </Box>
          )}
          {searchStatus === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircleOutline
                sx={{
                  color: "primary.main",
                  fontSize: 60,
                  display: "block",
                  margin: "auto",
                }}
              />
              <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
                Success! Here are the results:
              </Typography>
              <Table sx={{ mt: 2 }}>
                <TableBody>
                  {searchResults.map((result: any, index: any) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(index)}
                      hover
                      selected={selectedResult === index}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell sx={{ textAlign: "center", width: "50%" }}>
                        {result.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", width: "50%" }}>
                        {result.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleChooseClick}
                  className="theme-button"
                  sx={{
                    mt: 2,
                  }}
                >
                  Choose
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>
      </Dialog>
    </>
  );
}
