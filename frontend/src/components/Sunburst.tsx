import React, { useEffect, useRef } from 'react';
import Sunburst from 'sunburst-chart';

interface SunburstNode {
  name: string;
  color?: string;
  size?: number;
  children?: SunburstNode[];
}

const names = [
  'IPInfo', 'organization', 'Malicious', 'HTMLInfo', 'device', 'meta contents',
  'HTML', 'html', 'Links', 'links (total', 'CertSH', 'validity summary', 'URLInfo',
  'submitted url', 'image srcs (total', 'common domains (domain', 'iframe srcs',
  'country', 'issuer names (issuer', 'redirects (url', 'html mytoken', 'URLInfo',
  'tls support', 'Benign', 'IPInfo', 'address', 'region', 'city'
];

const parents = [
  'Malicious', 'IPInfo', '', 'Malicious', 'HTMLInfo', 'HTMLInfo', 'Malicious', 'HTML',
  'Malicious', 'Links', 'Malicious', 'CertSH', 'Malicious', 'URLInfo', 'Links', 'CertSH',
  'Links', 'IPInfo', 'CertSH', 'HTMLInfo', 'HTML', 'Benign', 'URLInfo', '', 'Benign',
  'IPInfo', 'IPInfo', 'IPInfo'
];

const values = [
  0.04679215115696071, 0.03868101233575445, 0.6, 0.0646750038446119, 0.033077942712252374,
  0.030531143957113503, 0.3793646797611303, 0.02630554954048282, 0.04819883565832123,
  0.02437257792806029, 0.041775333108788996, 0.02303340037161677, 0.01919399647018684,
  0.01919399647018684, 0.013536105947609183, 0.01096995381449238, 0.010290151782651757,
  0.008111138821206258, 0.007771978922679847, 0.0010659171752460182, 0.35305913022064744,
  0.14591591179186134, 0.14591591179186134, 0.4, 0.2540840882081387, 0.12197004071323742,
  0.12197004071323742, 0.010144006781663835
];

const buildTree = (names: string[], parents: string[], values: number[]): SunburstNode => {
  const root: SunburstNode = { name: 'root', size: 0, children: [] };
  const nodes: { [key: string]: SunburstNode } = { '': root };

  for (let i = 0; i < names.length; i++) {
    const name = names[i].trim();
    const parentName = parents[i].trim();
    const value = values[i];

    const parentNode = nodes[parentName] || { name: parentName, children: [] };

    const color = (name === 'Malicious' || parentName === 'Malicious') ? '#2573a1' : 
                  (name === 'Benign' || parentName === 'Benign') ? '#db4130' : 
                  parentNode.color || undefined;

    const node: SunburstNode = {
      name: name,
      size: value,
      color: color
    };

    parentNode.children = parentNode.children || [];
    parentNode.children.push(node);

    nodes[parentName] = parentNode;
    nodes[name] = node;
  }

  const assignColors = (node: SunburstNode, parentColor?: string) => {
    node.color = node.color || parentColor;
    if (node.children) {
      node.children.forEach(child => assignColors(child, node.color));
    }
  };

  assignColors(root);
  return root;
};

const sunburstData: SunburstNode = buildTree(names, parents, values);

const SunburstChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      Sunburst()
        .data(sunburstData)
        .size('size')
        .color('color')
        .radiusScaleExponent(2)
        (chartRef.current);
    }
  }, []);

  return <div id="chart" ref={chartRef} style={{ display:"flex",height: '50vh',justifyContent:"center" }}></div>;
};

export default SunburstChartComponent;
