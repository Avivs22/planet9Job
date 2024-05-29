import { Box, CircularProgress, Dialog } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import ReactJson from "react-json-view";
import CloseButton from "../components/CloseButton";
import { useRawJsonQuery } from "../common/api/investigateApi.ts";

export interface ViewJsonRawDialogProps {
  open: boolean;
  onClose: () => void;
}

// TODO use atom here
export function ViewJsonRawDialog(props: ViewJsonRawDialogProps) {
  const { data, isLoading } = useRawJsonQuery(
    {
      url: "Sdf" ?? "",
    },
    true,
  );

  // TODO consider global css
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={"xl"} fullWidth>
      <Box
        className={
          !data
            ? "theme-box loading-base loading-small-blur"
            : "theme-box loading-base"
        }
      >
        <CloseButton sx={{ top: 10, right: 10 }} onClick={props.onClose} />
        {!data ? (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ReactJson
            style={{ borderRadius: "3px" }}
            src={data}
            theme="bright"
            collapsed={false}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={true}
          />
        )}
      </Box>
    </Dialog>
  );
}
