import { Close } from '@mui/icons-material';
import { IconButton, IconButtonProps} from '@mui/material';


interface CloseButtonProps extends IconButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick, sx ,...iconButtonProps }: CloseButtonProps) {
  return (
    <IconButton
    sx={{ position: 'absolute', top: 16, right: 16,...sx }}
    {...iconButtonProps}
    onClick={onClick}
  >
    <Close />
  </IconButton>
  )
}


