import React from 'react';

const TableSection = ({children, className, ...props}) => {
    return (
        <div className={`scroll_div pt-3 overflow-on ${className}`} {...props} >
            {children}
        </div>
    );
};

export default TableSection;