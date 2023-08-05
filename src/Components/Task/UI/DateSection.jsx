import React from 'react';

const DateSection = ({children, className, ...props}) => {
    return (
        <div className={`row text-start mt-3 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default DateSection;