import { Box, Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export interface ShowImageDialogProps {
  open: boolean;
  onClose: () => void;
  imgSrc: string;
}

export function ShowImageDialog(props: ShowImageDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="xl">
      <div
        style={{
          backgroundColor: "black",
          position: "relative",
          height: "50rem",
          width: "50rem"
        }}
      >
        <img
          alt="Screenshot"
          src={props.imgSrc}
          style={{
            width: "100%",
            height: "100%",
            position: "static",
          }}
        />

        <IconButton
          sx={{ position: "absolute", right: 16, top: 16 }}
          onClick={() => props.onClose()}
        >
          <Close sx={{ color: "black" }} />
        </IconButton>
      </div>
    </Dialog>
  );
}
