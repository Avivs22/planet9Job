import React from 'react';

const BreadCrumb = ({ path = [] }) => {
    return (
        <div>
            <h2>{path.reduce((acc, val) => { return acc + ' | ' + val; })}</h2>
        </div>
    );
};

export { BreadCrumb };