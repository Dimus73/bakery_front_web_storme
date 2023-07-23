import React from 'react';

const SearchSection = ({children, ...props}) => {
    return (

        <div {...props} className='row font-comfortaa'>
            <div className='col-lg-2'></div>
            <div className='col-12 col-lg-4'>
                {children}
            </div>
        </div>
    );
};

export default SearchSection;