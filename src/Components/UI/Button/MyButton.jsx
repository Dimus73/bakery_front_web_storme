import React from 'react';

const MyButton = ({children, onClick,...props}) => {
    return (
        <div {...props}>
            <button className="btn btn-outline-danger" onClick>
                {children}
            </button>
        </div>
    );
};


// const MyButton = ({children, ...props}) => {
//     return (
//         <button {...props}>
//             {children}
//         </button>
//     );
// };
export default MyButton;