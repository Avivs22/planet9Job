import './styles.css';
import { Grid, Typography,Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBatchEnticementInfoQuery } from '../../common/api';

type BatchEnticementInfo = {
  adult_content_and_dating: number;
  finance_and_banking: number;
  job_scam: number; 
  business_and_ecommerce: number; 
  other: number;
  benign: number; 
  url_is_ood: number; 
  not_inferenced_yet: number;
  batch_uuid: string;
};


interface EnticementBarComponentParams {
  batch_uuid: string;
}

const Enticement = () => {

  const { batch_uuid } = useParams<EnticementBarComponentParams>();

  // Fetch Inference 
//   const { data1: inferenceData, isLoading: isLoadingInference } = useGetBatchInferenceInfoQuery<BatchInferenceInfo[]>({ batch_uuid });
//   console.log("---")
  const enticement = useGetBatchEnticementInfoQuery<BatchEnticementInfo[]>({ batch_uuid });
  const enticementData = enticement.data;
  var totalEnticement;
  if (enticementData){
    totalEnticement = Object.values(enticementData)
      .filter(value => typeof value === 'number') // Exclude non-numeric values
      .reduce((acc, value) => acc + value, 0);
    }
    const adultContentDatingPercentage = ((enticementData?.adult_content_and_dating / totalEnticement) * 100).toFixed(2);
    const financeBankingPercentage = ((enticementData?.finance_and_banking / totalEnticement) * 100).toFixed(2);
    const jobScamPercentage = ((enticementData?.job_scam / totalEnticement) * 100).toFixed(2);
    const businessEcommercePercentage = ((enticementData?.business_and_ecommerce / totalEnticement) * 100).toFixed(2);
    const otherPercentage = ((enticementData?.other / totalEnticement) * 100).toFixed(2);
    const benignEcommercePercentage = ((enticementData?.benign / totalEnticement) * 100).toFixed(2);
    const urlOodEcommercePercentage = ((enticementData?.url_is_ood / totalEnticement) * 100).toFixed(2);
    const notInferencedEcommercePercentage = ((enticementData?.not_inferenced_yet / totalEnticement) * 100).toFixed(2);

    return (
      <Grid item xs={12} sm={6}>
        <Typography sx={{ textAlign: "center", fontFamily:"'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>Enticement</Typography>
        <div className="progress-bar">
          <Tooltip title={`${adultContentDatingPercentage}%`} arrow>
            <div className="progress-bar-part adult-content" style={{ width: `${adultContentDatingPercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${financeBankingPercentage}%`} arrow>
            <div className="progress-bar-part finance-banking" style={{ width: `${financeBankingPercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${jobScamPercentage}%`} arrow>
            <div className="progress-bar-part job-scam" style={{ width: `${jobScamPercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${businessEcommercePercentage}%`} arrow>
            <div className="progress-bar-part business-ecommerce" style={{ width: `${businessEcommercePercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${otherPercentage}%`} arrow>
            <div className="progress-bar-part other" style={{ width: `${otherPercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${benignEcommercePercentage}%`} arrow>
            <div className="progress-bar-part benign" style={{ width: `${benignEcommercePercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${urlOodEcommercePercentage}%`} arrow>
            <div className="progress-bar-part url-ood" style={{ width: `${urlOodEcommercePercentage}%` }}></div>
          </Tooltip>
          <Tooltip title={`${notInferencedEcommercePercentage}%`} arrow>
            <div className="progress-bar-part not-inferenced-yet" style={{ width: `${notInferencedEcommercePercentage}%` }}></div>
          </Tooltip>
        </div>
        <div className="legend">
          <div className="legend-item"><div className="circle adult-content"></div>Adult Content</div>
          <div className="legend-item"><div className="circle finance-banking"></div>Finance and Banking</div>
          <div className="legend-item"><div className="circle job-scam"></div>Job Scam</div>
          <div className="legend-item"><div className="circle business-ecommerce"></div>Business and Ecommerce</div>
          <div className="legend-item"><div className="circle other"></div>Other</div>
          <div className="legend-item"><div className="circle benign"></div>Benign</div>
          <div className="legend-item"><div className="circle url-ood"></div>Url OOD</div>
          <div className="legend-item"><div className="circle not-inferenced-yet"></div>Not Inferenced Yet</div>
        </div>
      </Grid>
    );
};

export default Enticement;
