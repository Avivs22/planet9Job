import React from 'react';
import './styles.css';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchInferenceInfoQuery, useGetBatchOodInfoQuery, useGetBatchStatusInfoQuery } from '../../common/api';
import Status from './status';


type BatchOODInfo = {
  not_ood: number;
  ood: number;
  not_inferenced_yet: number;
  batch_uuid: string;
};


interface OODBarComponentParams {
  batch_uuid: string;
}

const OOD = () => {

  const { batch_uuid } = useParams<OODBarComponentParams>();

  // Fetch Inference 
//   const { data1: inferenceData, isLoading: isLoadingInference } = useGetBatchInferenceInfoQuery<BatchInferenceInfo[]>({ batch_uuid });
//   console.log("---")
  const ood = useGetBatchOodInfoQuery<BatchOODInfo[]>({ batch_uuid });
  console.log(ood);  
  const oodData = ood.data;
  var totalOOD;
  if (oodData){
    totalOOD = Object.values(oodData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
    }
    const notOodPercentage = ((oodData?.not_ood / totalOOD) * 100).toFixed(2);
    const oodPercentage = ((oodData?.ood / totalOOD) * 100).toFixed(2);
    const notInferencedYetPercentage = ((oodData?.not_inferenced_yet / totalOOD) * 100).toFixed(2);
    console.log("Happy")
    console.log(oodData);

  return (            
    <Grid item xs={12} sm={6} >
        <Typography>OOD</Typography>
        <div className="progress-bar">
            <div className="progress-bar-part not-ood" style={{ width: `${notOodPercentage}%`}}>{notOodPercentage}%</div>
            <div className="progress-bar-part ood" style={{ width: `${oodPercentage}%`}}>{oodPercentage}%</div>
            <div className="progress-bar-part not-inferenced-yet" style={{ width: `${notInferencedYetPercentage}%`}}>{notInferencedYetPercentage}%</div>
        </div>
        <div className="legend">
            <div className="legend-item"><div className="circle not-ood"></div>Not OOD</div>
            <div className="legend-item"><div className="circle ood"></div>OOD</div>
            <div className="legend-item"><div className="circle not-inferenced-yet"></div>Not Inferenced Yet</div>
        </div>
    </Grid>

  );
};

export default OOD;
