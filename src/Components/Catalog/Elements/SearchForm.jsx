import React from 'react';

const SearchForm = ( { searchStr, setSearchStr } ) => {
    return (
        <form action="">
            <div className='row'>
                <div className='col-10'>
                    <input className='form-control'
                           type="text"
                           value={searchStr}
                           onChange={(e) => setSearchStr(e.target.value)}
                           placeholder='Enter to filter'
                    />
                </div>
                <div className='col-1'>
                    <i className="bi bi-x-square"
                       style={{fontStyle: '1.8rem', color: "#BD302D"}}
                       onClick={(e) => setSearchStr('') }></i>
                </div>
            </div>
        </form>
    );
};

export default SearchForm;