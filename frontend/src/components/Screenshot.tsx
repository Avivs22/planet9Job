 import SamplePNG from "../../../backend/sample.png"
 import React, { useState, useEffect, } from 'react';
 import { useAtomValue,atom } from 'jotai'
 import {
     Alert,
     Box,
     Card,
     CircularProgress,
     Grid,
     IconButton,
     Stack, SxProps,
     Typography, CardProps,
   } from "@mui/material";
   import {useScreenshotQuery} from '../../common/api/investigateApi.ts';
   import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
   import { ShowImageDialog } from '../dialogs/ShowImage.tsx';
   import expandIcon from '../assets/icons/expand.svg';

   const GORILLA_ENABLED = false;

   interface InferenceResult {
    url: string;
  }
  
   const inferenceResultAtom = atom<undefined | null | InferenceResult>(null);

//  export interface ScreenshotCardProps extends CardProps {
//     device: string;
//   }
export default function ScreenshotCard() {
    const result = useAtomValue(inferenceResultAtom);  
    const [error, setError] = useState(false);
    const [errorStage, setErrorStage] = useState(false);
  
    const [loading, setLoading] = useState(false);
  
    const [open, setOpen] = useState(false);
    // const [searchParams] = useSearchParams();
    // const url = searchParams.get('url');
  
  
    const screenshotUrl = SamplePNG;

    // const handleImageLoaded = () => {
    //   setLoading(false);
    // };
    // const handleImageError = (error: any) => {
    //   setLoading(false);
    //   setError(true);
    //   setErrorStage(false);
    // };
  
    useEffect(() => {
      if (result?.url)
        setLoading(true);
      setError(false);
    }, [result?.url]);
  
    useEffect(() => {
      if (error && !errorStage) {
        setTimeout(() => {
          setErrorStage(true);
        }, 3000);
      }
    }, [error, errorStage]);
  
    return (
      <Card sx={{ p: 2, position: 'relative', height: "20rem", width: "20rem"}}>
        {screenshotUrl && (
          <ShowImageDialog
            open={open}
            onClose={() => setOpen(false)}
            imgSrc={screenshotUrl}
            
          />
        )}
  
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            fontFamily="Helvetica Medium"
          >
            Screenshot
          </Typography>
  
          <IconButton onClick={() => setOpen(true)} disabled={!screenshotUrl}>
            <img alt="Expand" src={expandIcon} style={{ width: 16, height: 16 }} />
          </IconButton>
        </Stack>
        
        {!open && (
            <img
                src={screenshotUrl}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Ensure the image fills the container

            />
        )}
        
        {(screenshotUrl || (error && GORILLA_ENABLED)) && (
          <Box sx={{overflow:"auto",height:"80%"}}>
            {(error && errorStage && GORILLA_ENABLED) && (
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute', top: 175, right: 250,
                  textShadow: '2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000',
                }}
              >
                Screenshot not found
              </Typography>
            )}
          </Box>
        )}
  
        {(error && !errorStage && GORILLA_ENABLED) && (
          <CircularProgress
            sx={{ position: 'absolute', top: 175, right: 160 }}
          />
        )}
  
        {loading && (
          <Alert
            severity="info"
            icon={
              <CircularProgress size={16} sx={{ mt: '2px' }} />
            }
          >
            Loading screenshot...
          </Alert>
        )}
  
        {!GORILLA_ENABLED && !loading && !screenshotUrl && (
          <Alert severity="info">
            No screenshot available.
          </Alert>
        )}
      </Card>
    )
  }
