import './styles.css';
import { Grid, Typography,Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchInferenceInfoQuery, useGetBatchStatusInfoQuery } from '../../common/api';

type BatchInferenceInfo = {
  benign: number;
  malicious: number;
  url_in_ood: number;
  not_started_yet: number;
  batch_uuid: string;
};


interface PercentageBarComponentParams {
  batch_uuid: string;
}

const Inference = () => {

  const { batch_uuid } = useParams<PercentageBarComponentParams>();

  // Fetch Inference 
//   const { data1: inferenceData, isLoading: isLoadingInference } = useGetBatchInferenceInfoQuery<BatchInferenceInfo[]>({ batch_uuid });
//   console.log("---")
  const inference = useGetBatchInferenceInfoQuery<BatchInferenceInfo[]>({ batch_uuid });
  console.log(inference);  
  const inferenceData = inference.data;
  var totalInference;
  if (inferenceData){
    totalInference = Object.values(inferenceData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
    }
    const benignPercentage = ((inferenceData?.benign / totalInference) * 100).toFixed(2);
    const maliciousPercentage = ((inferenceData?.malicious / totalInference) * 100).toFixed(2);
    const urlInOODPercentage = ((inferenceData?.url_in_ood / totalInference) * 100).toFixed(2);
    const notInferencedYetPercentage = ((inferenceData?.not_started_yet / totalInference) * 100).toFixed(2);

    console.log(totalInference);

    return (
      <Grid item xs={12} sm={6}>
        <Typography sx={{ textAlign: "center" , fontFamily:"'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"}}>Inference</Typography>
        <div className="progress-bar">
          <Tooltip title={`${benignPercentage}%`} arrow>
            <div className="progress-bar-part benign" style={{ width: `${benignPercentage}%` }}>{benignPercentage}%</div>
          </Tooltip>
          <Tooltip title={`${maliciousPercentage}%`} arrow>
            <div className="progress-bar-part malicious" style={{ width: `${maliciousPercentage}%` }}>{maliciousPercentage}%</div>
          </Tooltip>
          <Tooltip title={`${urlInOODPercentage}%`} arrow>
            <div className="progress-bar-part url-ood" style={{ width: `${urlInOODPercentage}%` }}>{urlInOODPercentage}%</div>
          </Tooltip>
          <Tooltip title={`${notInferencedYetPercentage}%`} arrow>
            <div className="progress-bar-part not-started-yet" style={{ width: `${notInferencedYetPercentage}%` }}>{notInferencedYetPercentage}%</div>
          </Tooltip>
        </div>
        <div className="legend">
          <div className="legend-item"><div className="circle benign"></div>Benign</div>
          <div className="legend-item"><div className="circle malicious"></div>Malicious</div>
          <div className="legend-item"><div className="circle url-ood"></div>URL in OOD</div>
          <div className="legend-item"><div className="circle not-started-yet"></div>Not Inferenced Yet</div>
        </div>
      </Grid>
    );
};

export default Inference;
