import {useEffect, useState} from "react";

function EquipmentAddForm ({currentItem, catalogActionButton}) {

    const [item, setItem] = useState({})

    useEffect (()=>{
        setItem({...currentItem})
    },[currentItem])

    const pushAddButton = async (e) => {
        e.preventDefault();
        await catalogActionButton.pushAddButton(item);
    }

    return (
        <>
            <div className='row'>
                <div>New</div>
            </div>
            <form className='font-comfortaa' onSubmit={ pushAddButton } action="">
                <div className='row justify-content-md-center' >
                    <div className='col-7'>
                        <input className='form-control' onChange={(e) => setItem ({...item, equipment:e.target.value}) }
                               type="text" name='equipment'  value = {item.equipment} placeholder="Enter equipment"/>
                    </div>
                    <div className='col-3'>
                        <input className='form-control' onChange={(e) => setItem ({...item, quantity:e.target.value}) }
                               name='quantity' value = {item.quantity} placeholder={"Quantity"}/>
                    </div>
                    <div  className='col-1'>
                        <button  className='btn m-1 me-md-2 btn-outline-danger' type='submit'>Add</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EquipmentAddForm