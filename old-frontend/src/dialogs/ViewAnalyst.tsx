import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Title from "../components/Title";
import CloseButton from "../components/CloseButton";


export interface FormValue<T> {
  item?: FormValueItem<T>[];
  default?: T;
  placeHolder?: string;
}

export interface FormValueOptions {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;
  color?: string;
}
export interface FormValueItem<T> {
  value: T;
  options?: FormValueOptions;
}

export interface FormValues<T> {

  enticementCategories: T;
  executionCategories: T;
  classification: T;
  freeText: T;
  filters: T extends string ? T[] : T;

}
export interface ViewAnalystDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues<string>) => Promise<void>
  formValues: FormValues<FormValue<string>>
}

export interface CustomDropDownProps {
  label: string;
  name: string;
  defaultValue: string | undefined;
  value: FormValueItem<string>[] | undefined;
  handleChange: (event: any) => void; // TODO more pesific type
}

export function CustomDropDown(props: CustomDropDownProps) {
  return (
    <TextField
      select
      fullWidth
      label={props.label}
      name={props.name}
      value={props.defaultValue}
      onChange={props.handleChange}
      margin="normal"
      SelectProps={{
        native: true,
      }}
    >
      <option value=""></option>
      {props.value?.map((item: FormValueItem<string>, index: number) => (
        <option key={index} value={item.value}>{item.value}</option>
      ))}
    </TextField>
  );
}

export function ViewAnalystDialog(props: ViewAnalystDialogProps) {
  const [formValues, setFormValues] = useState<FormValues<FormValue<string>> | undefined>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false)

  useEffect(() => {
    setFormValues(props.formValues)
  }, [props.formValues]);


  const handleFilterToggle = (filter: any) => {
    setSelectedFilters((prevState) => {
      const currentIndex = prevState.indexOf(filter);
      const newSelectedFilters = [...prevState];

      currentIndex === -1 ? newSelectedFilters.push(filter) : newSelectedFilters.splice(currentIndex, 1);

      return newSelectedFilters;
    });
  };


  const handleChangeEventWrapper = (event: any) => {
    const { name, value } = event.target;
    handleChange(name, value)
  };

  const handleChange = (name: string, value: string) => {
    setFormValues(prevState => {
      if (!prevState) return undefined;
      const key = name as keyof FormValues<FormValue<string>>
      const updatedValue = { ...prevState[key], default: value };
      return {
        ...prevState,
        [name]: updatedValue,
      };
    });
  };

  // TODO check for better way
  const handleSubmit = async () => {
    const values = {
      enticementCategories: formValues?.enticementCategories?.default,
      executionCategories: formValues?.executionCategories?.default,
      classification: formValues?.classification?.default,
      freeText: formValues?.freeText?.default,
      filters: selectedFilters,
    } as FormValues<string>

    try {
      setIsloading(true)
      await props.onSubmit(values)
      toast.success('Form submitted successfully!', { progressStyle: { background: 'linear-gradient(to left, #6ab4ff, #c2a6ff)' } });
    } catch (error) {
      console.log(error)
      toast.error('Failed to submit the form.');
    }
    finally {
      setIsloading(false)
    }
  };

  const handleClassificationChange = (name: string, newClassification: string) => {
    if (newClassification !== null) {
      handleChange(name, newClassification);
    }
  };


  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth={"xl"}
      fullWidth >
      <Box className='theme-box'>
        <CloseButton onClick={props.onClose} />
        {formValues &&
          <>
            <Title value="Report"></Title>

            <ToggleButtonGroup
              value={formValues.classification.default}
              exclusive
              onChange={(event, newClassification) => handleClassificationChange('classification', newClassification)}
              aria-label="Classification"
            >
              {formValues.classification.item?.map((type) => (
                <ToggleButton key={type?.value} value={type?.value} aria-label={type?.value} sx={{
                  color: type?.options?.color,
                  '&:hover': {
                    backgroundColor: type?.options?.hoverBackgroundColor
                  },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    borderWidth: '2px',
                    color: type?.options?.color,
                    borderStyle: 'solid',
                    backgroundColor: type?.options?.selectedBackgroundColor,
                    zIndex: 2,
                    boxShadow: '0 0 0 2px lightgrey'
                  },
                }}>
                  {type.value}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <CustomDropDown
              label="Enticement Categories"
              name="enticementCategories"
              defaultValue={formValues.enticementCategories.default}
              handleChange={handleChangeEventWrapper}
              value={formValues.enticementCategories?.item}
            />

            <CustomDropDown
              label="Execution Categories"
              name="executionCategories"
              defaultValue={formValues.executionCategories.default}
              handleChange={handleChangeEventWrapper}
              value={formValues.executionCategories?.item}
            />

            <TextField
              fullWidth
              label="Notes"
              name="freeText"
              placeholder={formValues.freeText?.placeHolder}
              onChange={handleChangeEventWrapper}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />

            <Title value="Reasons" sx={{ mt: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(formValues.filters as FormValue<string>).item?.map((filter: FormValueItem<string>) => (
                <Chip
                  key={filter.value}
                  label={filter.value}
                  clickable
                  color="primary"
                  onClick={() => handleFilterToggle(filter.value)}
                  variant={selectedFilters.includes(filter.value) ? 'filled' : 'outlined'}
                  sx={{
                    fontSize: '1rem',
                  }}
                />
              ))}
            </Box>
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="center">
              <Grid item xs={1} >
                <Button variant="contained"
                  className="theme-button"
                  disabled={isLoading}
                  onClick={handleSubmit}>
                  Save
                  {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                </Button>
              </Grid>
            </Grid>
          </>}

      </Box>
      <ToastContainer position="bottom-center" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss />
    </Dialog>
  )
}