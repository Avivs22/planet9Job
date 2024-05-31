import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface AddCaseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (name: string) => void;
}

export function AddCaseDialog(props: AddCaseDialogProps) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    props.onCreate?.(name);
    props.onClose();
  };

  useEffect(() => {
    if (props.open) {
      setName("");
    }
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      maxWidth="sm"
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
        <Typography variant="h5" sx={{ mb: 3 }}>
          Add new case
        </Typography>

        <TextField
          fullWidth
          autoFocus
          label="Case name"
          placeholder="Enter case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="contained"
            sx={{ color: "white", textTransform: "none" }}
            onClick={handleAdd}
            disabled={!name.trim()}
          >
            Add
          </Button>

          <Button
            variant="outlined"
            sx={{ color: "white", textTransform: "none" }}
            onClick={() => props.onClose()}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
