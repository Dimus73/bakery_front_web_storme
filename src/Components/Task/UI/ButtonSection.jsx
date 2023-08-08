import React from 'react';

const ButtonSection = ({children, className, ...props}) => {
    return (
        <div className={`flex-row d-flex ${className}`} {...props} >
            {children}
        </div>
    );
};

export default ButtonSection;