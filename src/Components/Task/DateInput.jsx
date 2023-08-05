import React from 'react';

const DateInput = ({task, setTask}) => {
    return (
        <>
            <div className='col'>
                <label className="form-label" htmlFor="taskDate">Date</label>
            </div>
            <div className='col'>
                <input className='datepicker form-control' type="date" name='taskDate' value={task.date}
                       onChange={(e) => setTask({...task, date: e.target.value})}/>
            </div>
        </>
    );
};

export default DateInput;