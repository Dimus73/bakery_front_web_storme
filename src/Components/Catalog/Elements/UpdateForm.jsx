import React, {useEffect, useState} from 'react';

function UpdateForm(props) {
    const [currentItem, setCurrentItem] = useState({})

    useEffect (()=>{
        setCurrentItem({
            id : props.item.id,
            equipment : props.item.equipment,
            quantity : props.item.quantity,
            active : props.item.active
        })
    },[props.item])

    return (
        <div>
            <div  className='row'>
                <div  className='font-comfortaa'>Edit equipment: {props.item.equipment}</div>
            </div>
            <form action="" className='form font-comfortaa'>
                <div className='row'>
                    <div className='col-7'>
                        <input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
                               type="text" name='equipment'  value = {currentItem.equipment}/>
                    </div>
                    <div className='col-3'>
                        <input  className='form-control' onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
                                name='quantity' value = {currentItem.quantity} />
                    </div>

                    <div className='col-1'>
                        <i className="bi bi-save2" style={{'font-size': '1.3rem', color: "#BD302D"}}
                           onClick={(e) => {
                               e.preventDefault();
                               props.updateEquipment(currentItem);} }></i>
                    </div>

                    <div className='col-1'>
                        <i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
                           onClick={(e) => {
                               e.preventDefault();
                               props.cancelUpdate ();}}></i>
                    </div>

                </div>
            </form>

        </div>
    );
}

export default UpdateForm;