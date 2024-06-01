import './styles.css';
import { Grid } from '@mui/material';
import Status from './status';
import Inference from './inference';
import OOD from './ood';
import Enticement from './enticement';

const PercentageBar = () => {


  return (
    <div className="progress-container">
      <Grid container spacing={15}>
        <Status />      
        <Inference />
        <OOD />
        <Enticement />

      </Grid>  
  </div>
  );
};

export default PercentageBar;
