import { Typography, TypographyProps} from '@mui/material';


interface TitleProps extends TypographyProps {
  value: string;
}

export default function Title({ value, sx ,...typographyProps }: TitleProps) {
  return (
    <Typography variant="h6" fontFamily="Helvetica Medium"
      sx={{ mb: 1, ...sx}} {...typographyProps} gutterBottom>
      {value}
    </Typography>
  )
}