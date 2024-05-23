import {Box, Button, Card, CircularProgress, Dialog, Typography} from "@mui/material";
import {useState} from "react";
import {usePredictV2Query} from "../../common/api/investigateApi.ts";
import {useAtomValue} from "jotai";
import {currentUrlAtom} from "../../state/ui.ts";


interface ViewModelInputDialogProps {
  url?: string;
  open: boolean;
  onClose: () => void;
}


function ViewModelInputDialog(props: ViewModelInputDialogProps) {
  const { data, isLoading } = usePredictV2Query({
    url: props.url ?? '',
  }, props.open && !!props.url);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& div.MuiPaper-root': {
          border: 0,
        }
      }}
    >
      <Box
        sx={{
          m: 0,
          p: 3,
          px: 6,
          borderRadius: '16px',
          position: 'relative',
          background: 'linear-gradient(#343d49 0%, #336497 100%)',
        }}
      >
        {isLoading && <CircularProgress sx={{ display: 'table', mx: 'auto' }} />}

        {!isLoading && data && (
          <>
            {data.input && (
              <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                <Typography whiteSpace="pre-wrap" fontFamily="monospace">
                  {data.input}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
}


export function ModelInputCard() {
  const [showDialog, setShowDialog] = useState(false);
  const url = useAtomValue(currentUrlAtom);

  return (
    <Card sx={{ p: 3 }}>
      <ViewModelInputDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        url={url ?? undefined}
      />

      <Button
        variant="contained"
        onClick={() => setShowDialog(true)}
        sx={{ display: 'table', mx: 'auto' }}
      >
        View Model Input
      </Button>
    </Card>
  );
}
