import React from 'react';

const ButtonSection = ({children, ...props}) => {
    return (
        <div {...props} >
            {children}
        </div>
    );
};

export default ButtonSection;