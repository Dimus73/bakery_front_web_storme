import React from 'react';

const EnterSection = ({children, ...props}) => {
    return (
        <div {...props} className='row justify-content-md-start'>
            <div className='col-lg-2'></div>
            <div className='form-box col-12 col-lg-6 mt-3 p-3'>
                {children}
            </div>
        </div>
    );
};

export default EnterSection;