import React, { ReactNode, useState } from "react";
import { Stack, Card, IconButton, InputAdornment, styled, TextField, Box, Grid, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { Upload, Search } from "@mui/icons-material";
import Dropzone from "./Dropzone";
import { ViewCsvSearchDialog } from "../dialogs/ViewCsvSearch";
import { ViewSearchDialog } from "../dialogs/ViewSearch";
import { ModelType } from "../state/ui";
import sortIcon from '../assets/icons/sort-az.svg'



interface ModelSelectProps {
  value: ModelType;
  onChange: (value: ModelType) => void;
}

function ModelSelect(props: ModelSelectProps) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Age"
      disabled
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as ModelType)}
      input={
        <OutlinedInput
          startAdornment={
            <InputAdornment position="start">
              <img src={sortIcon} style={{ width: 24, marginLeft: 4 }} />
              <Typography color="#ffffff80" sx={{ ml: 0.5 }}>Model:</Typography>
            </InputAdornment>
          }
          label="Source"
        />
      }
      sx={{
        backgroundColor: '#ffffff20', // match the color from your image
        borderRadius: 8,

        '&.MuiInputBase-root': {
          height: 64,
        },

        '& .MuiOutlinedInput-notchedOutline': {
          border: 'undefined',
        },

        '& .MuiSelect-select': {
          // paddingLeft: '1em', // or any specific padding
          mr: 1,
        },

        '& .MuiSvgIcon-root': {
          right: 14,
        },

        // add drop shadow
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <MenuItem value={ModelType.CONTENT}>Content</MenuItem>
      <MenuItem value={ModelType.BALANCED}>Global</MenuItem>
      <MenuItem value={ModelType.IMBALANCED}>Localized</MenuItem>
    </Select>
  );
}



export const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px', // Rounded borders
    backgroundColor: '#0f121a66', // Gray background color
    height: '64px', // Specify the height of the input
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none', // Remove default border
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 15px', // Adjust input padding
  },
  '& .MuiSvgIcon-root': {
    color: 'white', // Adjust icon color
    marginLeft: 12,
  }
});


export interface SearchCardModelProps {
  disabled?: boolean;
  placeholder?: string;
  onURLSubmit: (value: string) => void;
  onFileSubmit?: (file: File) => void
  submitIcon?: ReactNode;
  leftAction?: ReactNode;
}


export function SearchCard(props: SearchCardModelProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isShowCsvUploadDialog, setIsShowCsvUploadDialog] = useState(false);
  const [modelType, setModelType] = useState<ModelType>(ModelType.CONTENT);



  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onUpload()
    }
  }

  const onUpload = () => {
    file && props.onFileSubmit ? setIsShowCsvUploadDialog(true) : setIsShowDialog(true);
  }

  const dropFunc = (file: File | undefined) => {
    if (file && file.type === "text/csv" && props.onFileSubmit) {
      setInputValue(file.name)
      setFile(file)
    } else {
      setInputValue("")
    }
  }

  const IconWrapper = ({ children }: { children: ReactNode }) => (
    <Box sx={{ width: 24, height: 24 }}>
      {children}
    </Box>
  );

  return (
    <Box

    >
      <Card
        sx={{
          p: 3,
          border: 'solid 2px #777',
        }}
      >
        <Stack direction="column" spacing={3}>

          <Stack direction="row" alignItems="center" spacing={3}>

            {/* <ModelSelect value={modelType} onChange={(v) => setModelType(v)} /> */}
            <SearchTextField
              placeholder={props.placeholder}
              disabled={props.disabled}
              fullWidth
              value={inputValue ? inputValue : ''}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconWrapper>
                      {props.submitIcon ?? <Search />}
                    </IconWrapper>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={props.disabled}
                      onClick={() => onUpload()}
                      sx={{
                        backgroundColor: '#ffffffcc',
                        '& .MuiSvgIcon-root': {
                          marginLeft: 0,
                          color: 'black',
                        },

                        '&:hover': {
                          backgroundColor: '#ffffffdd',
                        }
                      }}
                    >

                      <IconWrapper>
                        {props.submitIcon ?? <Search />}
                      </IconWrapper>                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          {props.onFileSubmit &&

            <Stack direction="row" sx={{ height: '100px' }} >
              <Dropzone
                onDrop={dropFunc}
                isMultipleSelection={false}
                maxNumOfFiles={1}
              />
            </Stack>
          }
        </Stack>

      </Card>
      {isShowDialog && <Grid item xs={12}>
        <ViewSearchDialog
          open={isShowDialog}
          onClose={() => { setIsShowDialog(false) }}
          search={props.onURLSubmit}
        />
      </Grid>}
      {isShowCsvUploadDialog && props.onFileSubmit && <Grid item xs={12}>
        <ViewCsvSearchDialog
          file={file}
          open={isShowCsvUploadDialog}
          onClose={() => { setIsShowCsvUploadDialog(false) }}
          search={props.onFileSubmit}
        />
      </Grid>
      }
    </Box>
  );
}

