import React, { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { Stack, Card, IconButton, InputAdornment, styled, TextField } from "@mui/material";
import { Height, Search } from "@mui/icons-material";
import Dropzone from "./Dropzone";


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


import { useSearch } from '../common/SearchContext.tsx'; 


export interface SearchCardModelProps {
  disabled?: boolean;
  placeholder?: string;
  onSearch: (value: string) => void;
  onFileUpload?: (file: File) => void
  leftAction?: ReactNode;
}

export interface SearchCardModelRef {
  setValue: (value: string) => void;
  value: string
}

function SearchCardModel_(props: SearchCardModelProps, ref: ForwardedRef<SearchCardModelRef>) {
  const { value, setValue } = useSearch();


  useImperativeHandle(ref, () => ({
    setValue,
    value,
  }));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      props.onSearch(value);
    }
  }

  const dropFunc = (file: File|undefined) => {
    if (file && file.type === "text/csv" && props.onFileUpload) {
      setValue(file.name)
      props.onFileUpload(file)
    }else{
      setValue("")
    }
  }
  return (
    <Card
      sx={{
        p: 3,
        border: 'solid 2px #777',
      }}
    >
      <Stack direction="column" spacing={3}>

        <Stack direction="row" alignItems="center" spacing={3}>
          {props.leftAction}

          <SearchTextField
            placeholder={props.placeholder}
            disabled={props.disabled}
            fullWidth
            value={value?value:''}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ width: 24, }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={props.disabled}
                    onClick={() => props.onSearch(value)}
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
                    <Search sx={{ width: 24, height: 24 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>
        {props.onFileUpload &&

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
  );
}

export const SearchCardModel = forwardRef(SearchCardModel_);
