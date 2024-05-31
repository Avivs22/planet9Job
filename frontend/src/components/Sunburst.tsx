import React, { useEffect, useRef } from 'react';
import Sunburst from 'sunburst-chart';

interface SunburstNode {
    name: string;
    color?: string;
    size?: number;
    children?: SunburstNode[];
  }
  
  const sunburstData: SunburstNode = {
    name: 'root',
    children: []
  };
  
  const names = ['IPInfo ', 'organization ', 'Malicious ', 'HTMLInfo ', 'device ', 'meta contents ', 'HTML ', 'html ', 'Links ', 'links (total ', 'CertSH ', 'validity summary ', 'URLInfo ', 'submitted url ', 'image srcs (total ', 'common domains (domain ', 'iframe srcs ', 'country ', 'issuer names (issuer ', 'redirects (url ', 'html mytoken ', 'URLInfo', 'tls support', 'Benign', 'IPInfo', 'address', 'region', 'city'];
  const parents = ['Malicious ', 'IPInfo ', '', 'Malicious ', 'HTMLInfo ', 'HTMLInfo ', 'Malicious ', 'HTML ', 'Malicious ', 'Links ', 'Malicious ', 'CertSH ', 'Malicious ', 'URLInfo ', 'Links ', 'CertSH ', 'Links ', 'IPInfo ', 'CertSH ', 'HTMLInfo ', 'HTML ', 'Benign', 'URLInfo', '', 'Benign', 'IPInfo', 'IPInfo', 'IPInfo'];
  const values = [0.04679215115696071, 0.03868101233575445, 0.6, 0.0646750038446119, 0.033077942712252374, 0.030531143957113503, 0.3793646797611303, 0.02630554954048282, 0.04819883565832123, 0.02437257792806029, 0.041775333108788996, 0.02303340037161677, 0.01919399647018684, 0.01919399647018684, 0.013536105947609183, 0.01096995381449238, 0.010290151782651757, 0.008111138821206258, 0.007771978922679847, 0.0010659171752460182, 0.35305913022064744, 0.14591591179186134, 0.14591591179186134, 0.4, 0.2540840882081387, 0.12197004071323742, 0.12197004071323742, 0.010144006781663835];
  
  // Helper function to build the tree
  const buildTree = (names: string[], parents: string[], values: number[]) => {
    const root: SunburstNode = { name: 'root', children: [] };
    const nodes: { [key: string]: SunburstNode } = { '': root };
  
    for (let i = 0; i < names.length; i++) {
      const name = names[i].trim();
      const parentName = parents[i].trim();
      const value = values[i];
  
      const node: SunburstNode = {
        name: name,
        size: value
      };
  
      if (!nodes[parentName]) {
        nodes[parentName] = { name: parentName, children: [] };
      }
  
      if (!nodes[parentName].children) {
        nodes[parentName].children = [];
      }
  
      nodes[parentName].children!.push(node);
      nodes[name] = node;
    }
  
    return root;
  };  


const SunburstChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    sunburstData.children = buildTree(names, parents, values).children;
  
    console.log(sunburstData);

    const data = {
      name: 'main',
      color: 'magenta',
      children: [{
        name: 'a',
        color: 'yellow',
        size: 1
      },{
        name: 'b',
        color: 'red',
        children: [{
          name: 'ba',
          color: 'orange',
          size: 1
        }, {
          name: 'bb',
          color: 'blue',
          children: [{
            name: 'bba',
            color: 'green',
            size: 1
          }, {
            name: 'bbb',
            color: 'pink',
            size: 1
          }]
        }]
      }]
    };

    if (chartRef.current) {
      Sunburst()
        .data(sunburstData)
        .size('size')
        .color('color')
        .radiusScaleExponent(1)
        (chartRef.current);
    }
  }, []);

  return <div id="chart" ref={chartRef} style={{ height: '100vh' }}></div>;
};

export default SunburstChartComponent;
