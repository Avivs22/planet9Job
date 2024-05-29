import React from 'react';
import './styles.css';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchInferenceInfoQuery, useGetBatchStatusInfoQuery } from '../../common/api';
import Status from './status';
import Inference from './inference';
import OOD from './ood';
import Enticement from './enticement';

const PercentageBar = () => {


  return (
    <div className="progress-container">
      <Grid container spacing={2}>
        <Status />      
        <Inference />
        <OOD />
        <Enticement />

      </Grid>  
  </div>
  );
};

export default PercentageBar;
