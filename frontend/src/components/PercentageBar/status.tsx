import React from 'react';
import './styles.css';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchInferenceInfoQuery, useGetBatchStatusInfoQuery } from '../../common/api';

type BatchStatusInfo = {
  done: number;
  inference: number;
  crawler: number;
  not_started_yet: number;
  batch_uuid: string;
};


interface PercentageBarComponentParams {
  batch_uuid: string;
}

const Status = () => {

  const { batch_uuid } = useParams<PercentageBarComponentParams>();

  // Fetch Status
  const status = useGetBatchStatusInfoQuery<BatchStatusInfo[]>({ batch_uuid });
  const statusData = status.data;
  var totalStatus;
  if (statusData){
    totalStatus = Object.values(statusData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
  }
  const donePercentage = (statusData?.done / totalStatus) * 100;
  const inferencePercentage = (statusData?.inference / totalStatus) * 100;
  const crawlerPercentage = (statusData?.crawler / totalStatus) * 100;
  const notStartedYetPercentage = (statusData?.not_started_yet / totalStatus) * 100;  
  console.log("Hello:", totalStatus)

  return (
    <Grid item xs={12} sm={6} >
        <Typography className="title">Status</Typography>
        <div className="progress-bar">
            <div className="progress-bar-part done" style={{ width: `${donePercentage}%`}}>{donePercentage}%</div>
            <div className="progress-bar-part inference" style={{ width: `${inferencePercentage}%`}}>{inferencePercentage}%</div>
            <div className="progress-bar-part crawler" style={{ width: `${crawlerPercentage}%`}}>{crawlerPercentage}%</div>
            <div className="progress-bar-part not-started-yet" style={{ width: `${notStartedYetPercentage}%`}}>{notStartedYetPercentage}%</div>
        </div>
        <div className="legend">
            <div className="legend-item"><div className="circle done"></div>Done</div>
            <div className="legend-item"><div className="circle inference"></div>Inference</div>
            <div className="legend-item"><div className="circle crawler"></div>Crawler</div>
            <div className="legend-item"><div className="circle not-started-yet"></div>Not started Yet</div>
        </div>
    </Grid>      
  );
};

export default Status;
