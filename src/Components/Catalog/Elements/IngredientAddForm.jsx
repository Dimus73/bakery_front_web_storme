import {useEffect, useState} from "react";

const IngredientAddForm = ( {currentItem, units, catalogActionButton} ) => {
    const [item, setItem] = useState({})

    useEffect (()=>{
        setItem({...currentItem})
    },[currentItem])

    const pushAddButton = async (e) => {
        // console.log("****ttttt*****")
        e.preventDefault();
        await catalogActionButton.pushAddButton(item);
    }

    return (
        <div>
            <div className='row'>
                <div className='font-comfortaa'>New</div>
            </div>
            <form className='font-comfortaa' onSubmit={pushAddButton} action="">
                <div className='row justify-content-md-center'>
                    <div className='col-7'>
                        <input className='form-control' onChange={(e) => setItem ({...item, name:e.target.value}) }
                               type="text" name='iName'  value = {item.name} placeholder="Enter ingredient"/>
                    </div>
                    <div className='col-3'>
                        <select className='form-select' onChange={(e) => setItem ({...item, unit_id:e.target.value}) }
                                name='iUnit' value = {item.unit_id} >
                            {units.map ((item) =>
                                <option key={item.id} value={item.id}>{item.unit_name}</option>
                            )}
                        </select>
                    </div>
                    <div className='col-1'>
                        <button id='btn1'  className='btn m-1 me-md-2 btn-outline-danger' type='submit'>Add</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default IngredientAddForm