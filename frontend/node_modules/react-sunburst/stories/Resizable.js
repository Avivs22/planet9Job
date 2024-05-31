import React from 'react';

const Resizable = ({ children }) => {
    let style = {
          width: '250px',
          height: '250px',
          resize: 'both',
          border: '2px solid',
          padding: '20px',
          overflow: 'auto'
    };

    return (
        <div style={ style }> { children } </div>
    );
};

export default Resizable;