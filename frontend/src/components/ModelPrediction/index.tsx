// src/StatusCard.js
import './styles.css';
import { useParams } from 'react-router-dom';
import { useGetModelPredictionInfoQuery } from '../../common/api';



type ModelPredictionInfo = {
  scams_model: {
    prediction: "Benign" | "Malicious" | "Not Inferenced Yet" | "URL is OOD";
    prediction_score: number;
  };
  ood_model: {
    prediction: "Not OOD" | "OOD" | "Not Inferenced Yet";
    prediction_score: number;
  };
  enticement_model: {
    prediction: 'Adult Content & Dating' | 'Finance & Banking' | 'Job Scam' | 'Business & E-Commerce' | 'Other' | 'Benign' | 'URL is OOD' | 'Not Inferenced Yet';
    prediction_score: number;
  };
};

type ModelPredictionComponentParams = {
  scan_uuid: string;
  enviroment:string;
}

const ModelPrediction = () => {
  const { scan_uuid, enviroment } = useParams<ModelPredictionComponentParams>();
  const { data } = useGetModelPredictionInfoQuery<ModelPredictionInfo>({ scan_uuid, enviroment });
  console.log(data)
  return (
    <div className="status-card" style={{marginBottom:"2rem",marginRight:"3rem"}}>
      <div className="status-item">
        <span className="label">INFERENCE</span>
        <span className="value" style={{ color: '#56ccf2' }}>{data?.scams_model.prediction}</span>
        <span className="probability">PROBABILITY - {data?.scams_model.prediction_score.toFixed(2)}</span>
      </div>
      <div className="status-item">
        <span className="label">OOD</span>
        <span className="value" style={{ color: '#f2994a' }}>{data?.ood_model.prediction}</span>
      </div>
      <div className="status-item">
        <span className="label">ENTICEMENT METHOD</span>
        <span className="value" style={{ color: '#ffffff' }}>{data?.enticement_model.prediction}</span>
      </div>
    </div>
  );
};

export default ModelPrediction;
