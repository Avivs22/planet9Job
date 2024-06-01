import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min'

interface SunburstNode {
  name: string;
  color?: string;
  size?: number;
  children?: SunburstNode[];
}

const labels = ["Malicous", "Benign", "HTML", "HTMLInfo", "Links", "IPInfo", "CertSH", "URLInfo","URLInfo2","IPInfo2","html mytoken","html","device","meta contests","redirects (url)","links (total)","image srcs (total)", "iframe srcs","organization","country","validilty summary","common domains (domain)", "issuer name (issuer)","submitted url","address","region","city","tls support"];

const parents =["", "", "Malicous", "Malicous", "Malicous", "Malicous", "Malicous", "Malicous","Benign","Benign","HTML","HTML","HTMLInfo","HTMLInfo","HTMLInfo","Links","Links","Links","IPInfo","IPInfo","CertSH","CertSH","CertSH","URLInfo","IPInfo2","IPInfo2","IPInfo2","URLInfo2"]

const values = [60, 40, 37.93646797611303, 6.46750038446119, 4.819883565832123, 4.679215115696071, 4.1775333108788996, 1.9193996470186842,14.591591179186134,25.40840882081387,35.305913022064744,2.630554954048282,3.3077942712252374,3.0531143957113503,0.10659171752460182,2.437257792806029,1.3536105947609183,1.0290151782651757,3.868101233575445,0.8111138821206258,2.303340037161677,1.096995381449238,0.7771978922679847,1.919399647018684,12.197004071323742,12.197004071323742,1.0144006781663835,14.591591179186134];


const layout = {
  "margin": {"l": 0, "r": 0, "b": 0, "t": 0},
};
  

const SunburstChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    Plotly.newPlot('chart', [{type: "sunburst",
    labels: labels,
    parents: parents,
    values: values,
    marker: { line: { width: 2 }},
    branchvalues: 'total'}], layout, {showSendToCloud: true})

  }, [])
  
  return <div id="chart" ref={chartRef} style={{ display:"flex",height: '50vh',justifyContent:"center" }}></div>;
};

export default SunburstChartComponent;
