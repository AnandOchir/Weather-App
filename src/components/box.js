import React from 'react';

export const Box = ({ children, className, ...others }) => {

    return (
        <div className={`box ${className}`} {...others}>
            {children}
        </div>
    );
};