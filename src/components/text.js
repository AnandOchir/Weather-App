import React from 'react';

export const Text = ({ children, className, ...others }) => {
   
    return (
        <h2 className={`text ${className}`} {...others}>
            {children}
        </h2>
    );
};