import React, {useEffect, useState} from 'react';

function EquipmentUpdateForm( {currentItem ,catalogActionButton} ) {
    const [item, setItem] = useState({})

    useEffect (()=>{
        setItem({...currentItem})
    },[currentItem])

    const localUpdateEquipment = async (e) => {
        e.preventDefault();
        await catalogActionButton.pushUpdateButton (item);
    }

    const localCanselUpdate = (e) => {
        e.preventDefault();
        catalogActionButton.pushCancelUpdateButton();
    }

    return (
        <div>
            <div  className='row'>
                <div  className='font-comfortaa'>Edit equipment: {item.equipment}</div>
            </div>
            <form action="" className='form font-comfortaa'>
                <div className='row'>
                    <div className='col-7'>
                        <input className='form-control' onChange={(e) => setItem ({...item, equipment:e.target.value}) }
                               type="text" name='equipment'  value = {item.equipment}/>
                    </div>
                    <div className='col-3'>
                        <input  className='form-control' onChange={(e) => setItem ({...item, quantity:e.target.value}) }
                                name='quantity' value = {item.quantity} />
                    </div>

                    <div className='col-1'>
                        <i className="bi bi-save2" style={{fontSize: '1.3rem', color: "#BD302D"}}
                           onClick={(e) => localUpdateEquipment(e) }></i>
                    </div>

                    <div className='col-1'>
                        <i className="bi bi-x-square" style={{fontSize: '1.3rem', color: "#BD302D"}}
                           onClick={(e) => localCanselUpdate(e)}></i>
                    </div>

                </div>
            </form>

        </div>
    );
}

export default EquipmentUpdateForm;