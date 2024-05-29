import React from 'react';
import './ChartShell.scss';

const ChartShell = ({ children, viewBox, width, height }) => {
    return (
        <div className='chart-shell'>
            <svg width={ width } height={ height } viewBox={ viewBox } preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
                { children }
            </svg>  
        </div>
    );
};

export default ChartShell;

ChartShell.defaultProps = {
    width: '100%',
    height: '100%',
    viewBox: ''
};