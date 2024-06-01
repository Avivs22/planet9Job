import { Grid, Typography, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchStatusInfoQuery } from '../../common/api';

type BatchStatusInfo = {
  done: number;
  inference: number;
  crawler: number;
  not_started_yet: number;
  batch_uuid: string;
};

const minPrecent = 15; // Define your minimum percentage here

const Status = () => {
  const { batch_uuid } = useParams();

  // Fetch Status
  const status = useGetBatchStatusInfoQuery<BatchStatusInfo[]>({ batch_uuid });
  const statusData = status.data;
  let totalStatus;
  if (statusData) {
    totalStatus = Object.values(statusData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
  }
  const donePercentage = (statusData?.done / totalStatus) * 100 || 0;
  const inferencePercentage = (statusData?.inference / totalStatus) * 100 || 0;
  const crawlerPercentage = (statusData?.crawler / totalStatus) * 100 || 0;
  const notStartedYetPercentage = (statusData?.not_started_yet / totalStatus) * 100 || 0;

  return (
    <Grid item xs={12} sm={6}>
      <Typography className="title" sx={{ textAlign: "center", fontFamily: "Courier, monospace", fontSize: "2rem" }}>Status</Typography>
      <div className="progress-bar">
        <Tooltip title={`${donePercentage}%`} arrow>
          <div className="progress-bar-part done" style={{ width: `${donePercentage}%` }}>
            {donePercentage > minPrecent ? `${donePercentage}%` : ''}
          </div>
        </Tooltip>
        <Tooltip title={`${inferencePercentage}%`} arrow>
          <div className="progress-bar-part inference" style={{ width: `${inferencePercentage}%` }}>
            {inferencePercentage > minPrecent ? `${inferencePercentage}%` : ''}
          </div>
        </Tooltip>
        <Tooltip title={`${crawlerPercentage}%`} arrow>
          <div className="progress-bar-part crawler" style={{ width: `${crawlerPercentage}%` }}>
            {crawlerPercentage > minPrecent ? `${crawlerPercentage}%` : ''}
          </div>
        </Tooltip>
        <Tooltip title={`${notStartedYetPercentage}%`} arrow>
          <div className="progress-bar-part not-started-yet" style={{ width: `${notStartedYetPercentage}%` }}>
            {notStartedYetPercentage > minPrecent ? `${notStartedYetPercentage}%` : ''}
          </div>
        </Tooltip>
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
