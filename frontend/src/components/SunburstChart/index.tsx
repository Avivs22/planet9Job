import React from 'react';
import Sunburst from 'sunburst-chart';
import jsonData from '../data.json';

const BENIGN = "Benign";
const SCAM = "Malicious";
const classNames = [BENIGN, SCAM];

function getParentForItem(item: string) {
    const firstToken = item.split(':')[0].trim().toLowerCase();

    if (firstToken.startsWith('url information') || firstToken.startsWith('submitted url') || firstToken.startsWith('tls support')) {
        return 'URLInfo';
    } else if (firstToken.startsWith('html information') || firstToken.startsWith('redirects (url') ||
        firstToken.startsWith('device') || firstToken.startsWith('meta')) {
        return 'HTMLInfo';
    } else if (firstToken.startsWith('ipinfo') || firstToken.startsWith('address') ||
        firstToken.startsWith('city') || firstToken.startsWith('organization') ||
        firstToken.startsWith('country') || firstToken.startsWith('region')) {
        return 'IPInfo';
    } else if (firstToken.startsWith('links') || firstToken.startsWith('total links') ||
        firstToken.startsWith('image') || firstToken.startsWith('iframe') || firstToken.startsWith('meta contents')) {
        return 'Links';
    } else if (firstToken.startsWith('html')) {
        return 'HTML';
    } else if (firstToken.startsWith('fullwhois') || firstToken.startsWith('creation') || firstToken.startsWith('expiration') ||
        firstToken.startsWith('total') || firstToken.startsWith('registrar') || firstToken.startsWith('domain status')) {
        return 'FullWhois';
    } else if (firstToken.startsWith('certsh') || firstToken.startsWith('common') || firstToken.startsWith('certificate') || firstToken.startsWith('validity') || firstToken.startsWith('issuer') ||
        firstToken.startsWith('common domains')) {
        return 'CertSH';
    } else {
        console.log(`Couldn't find a parent category for: ${firstToken}`);
        return '';
    }
}

function sunburstExpl(jsonData: any, label: number | null, sampleIdx: number) {
    const aggregatedScoresBenign: { [key: string]: number } = {};
    const aggregatedScoresScam: { [key: string]: number } = {};
    const parents: string[] = [];
    const tokensToParentsBenign: { [key: string]: string } = {};
    const tokensToParentsScam: { [key: string]: string } = {};
    const scores: number[] = [];
    const elements: string[] = [];
    tokensToParentsScam[SCAM] = '';
    tokensToParentsBenign[BENIGN] = '';

    function processItem(item: any, label: number | null) {
        const importance = item.importance;
        const tokens = item.token.split(':');
        let token = tokens[0].trim();
        if (token.startsWith('fullwhois') || token.startsWith('ipinfo') ||
            token.startsWith('htmlinfo') || token.startsWith('html information') ||
            token.startsWith('certsh') || token.startsWith('url')) {
            token = tokens[1].trim();
        }

        const parent = getParentForItem(token);
        if (parent.length > 1) {
            if (importance >= 0) {
                tokensToParentsScam[token] = parent;
                aggregatedScoresScam[parent] = (aggregatedScoresScam[parent] || 0) + importance;
                aggregatedScoresScam[token] = (aggregatedScoresScam[token] || 0) + importance;
                tokensToParentsScam[parent] = SCAM;
                aggregatedScoresScam[SCAM] = (aggregatedScoresScam[SCAM] || 0) + importance;
            } else {
                tokensToParentsBenign[token] = parent;
                aggregatedScoresBenign[parent] = (aggregatedScoresBenign[parent] || 0) + Math.abs(importance);
                aggregatedScoresBenign[token] = (aggregatedScoresBenign[token] || 0) + Math.abs(importance);
                tokensToParentsBenign[parent] = BENIGN;
                aggregatedScoresBenign[BENIGN] = (aggregatedScoresBenign[BENIGN] || 0) + Math.abs(importance);
            }
        }
    }

    for (const input of jsonData.lime_results) {
        if (label == null || label === parseInt(input.classification)) {
            const explanation = input.explanation;
            for (const item of explanation) {
                processItem(item, label);
            }
        }
    }

    for (const key in aggregatedScoresScam) {
        parents.push(key === SCAM ? '' : tokensToParentsScam[key] + ' ');
        scores.push((aggregatedScoresScam[key] / aggregatedScoresScam[SCAM]) * parseFloat(jsonData.lime_results[sampleIdx][SCAM]));
        elements.push(key + ' ');
    }

    for (const key in aggregatedScoresBenign) {
        parents.push(tokensToParentsBenign[key]);
        scores.push((aggregatedScoresBenign[key] / aggregatedScoresBenign[BENIGN]) * parseFloat(jsonData.lime_results[sampleIdx][BENIGN]));
        elements.push(key);
    }

    return {
        names: elements,
        parents: parents,
        values: scores
    };
}

const SunburstChart: React.FC<{ sampleIdx: number; countBy: string; dataKey: string; onClick: (d: any) => void }> = ({ sampleIdx, countBy, dataKey, onClick }) => {
    const plotData = sunburstExpl(jsonData, 1, sampleIdx);

    return (
        <Sunburst
            data={plotData}
            height={400}
            width={400}
            countBy={countBy}
            dataKey={dataKey}
            stroke="#fff"
            strokeWidth={2}
            onClick={onClick}
        />
    );
};

export default SunburstChart;
