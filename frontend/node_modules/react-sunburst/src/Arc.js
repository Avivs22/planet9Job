import React from 'react'; 

const Arc = ({ d, style, onMouseOver }) => {
    return (
        <path className='arc-path fade-color' onMouseOver={ onMouseOver } d={ d } style={ style } ></path>
    );
};

Arc.propTypes = {
    d: React.PropTypes.string.isRequired
};

export default Arc; 