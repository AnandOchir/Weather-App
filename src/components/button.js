import React from 'react';

export const Button = ({ children, disabled, className, ...others }) => {
   
    return (
        <button className={`btn ${className} ${disabled && 'disabled'}`} {...others}>
            {children}
        </button>
    );
};