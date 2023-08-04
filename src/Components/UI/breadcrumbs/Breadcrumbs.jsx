import React from 'react';

const Breadcrumbs = ({children, ...props}) => {
    return (
        <h6 {...props}>
            {children}
        </h6>
    );
};

export default Breadcrumbs;