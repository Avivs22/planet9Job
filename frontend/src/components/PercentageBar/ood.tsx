import { Grid, Typography, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchOodInfoQuery } from '../../common/api';

type BatchOODInfo = {
  not_ood: number;
  ood: number;
  not_inferenced_yet: number;
  batch_uuid: string;
};

const minPrecent = 15; // Define your minimum percentage here

const OOD = () => {
  const { batch_uuid } = useParams();

  // Fetch OOD info
  const ood = useGetBatchOodInfoQuery<BatchOODInfo[]>({ batch_uuid });
  const oodData = ood.data;
  let totalOOD;
  if (oodData) {
    totalOOD = Object.values(oodData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
  }
  const notOodPercentage = ((oodData?.not_ood / totalOOD) * 100 || 0).toFixed(2);
  const oodPercentage = ((oodData?.ood / totalOOD) * 100 || 0).toFixed(2);
  const notInferencedYetPercentage = ((oodData?.not_inferenced_yet / totalOOD) * 100 || 0).toFixed(2);

  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ textAlign: "center", fontFamily: "Courier, monospace", fontSize: "2rem" }}>OOD</Typography>
      <div className="progress-bar">
        <Tooltip title={`${notOodPercentage}%`} arrow>
          <div className="progress-bar-part not-ood" style={{ width: `${notOodPercentage}%` }}>
            {parseFloat(notOodPercentage) > minPrecent ? `${notOodPercentage}%` : ''}
          </div>
        </Tooltip>
        <Tooltip title={`${oodPercentage}%`} arrow>
          <div className="progress-bar-part ood" style={{ width: `${oodPercentage}%` }}>
            {parseFloat(oodPercentage) > minPrecent ? `${oodPercentage}%` : ''}
          </div>
        </Tooltip>
        <Tooltip title={`${notInferencedYetPercentage}%`} arrow>
          <div className="progress-bar-part not-inferenced-yet" style={{ width: `${notInferencedYetPercentage}%` }}>
            {parseFloat(notInferencedYetPercentage) > minPrecent ? `${notInferencedYetPercentage}%` : ''}
          </div>
        </Tooltip>
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
