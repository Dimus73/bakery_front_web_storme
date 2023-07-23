import React from 'react';

const WhitePageSection = ({children, ...props}) => {
    return (
        <div {...props} className='container bg-white p-5 shadow-lg'>
            {children}
        </div>
    );
};

export default WhitePageSection;