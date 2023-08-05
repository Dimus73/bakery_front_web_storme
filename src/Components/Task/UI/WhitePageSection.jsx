import React from 'react';


const WhitePageSection = ({children, ...props}) => {
    return (
        <div className='col-12 col-lg-6  font-comfortaa'>
            <div className='container  bg-white p-5 pb-3 pt-3 shadow-lg'>
                {children}
            </div>
        </div>
    );
};

export default WhitePageSection;