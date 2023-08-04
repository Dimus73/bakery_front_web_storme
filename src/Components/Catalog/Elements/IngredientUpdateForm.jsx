import {useEffect, useState} from "react";

function IngredientUpdateForm  ( {currentItem, units ,catalogActionButton} ) {
    const [item, setItem] = useState({})

    useEffect (()=>{
        setItem({...currentItem})
    },[currentItem])

    const localUpdateIngredient = async (e) => {
        e.preventDefault();
        await catalogActionButton.pushUpdateButton (item);
    }

    const localCanselUpdate = (e) => {
        e.preventDefault();
        catalogActionButton.pushCancelUpdateButton();
    }

    return (
        <div>
            <div className='row'>
                <div  className='font-comfortaa'>Edit ingredient: {item.name}</div>
            </div>
            <form action="" className='form font-comfortaa'>
                <div className='row'>
                    <div className='col-7'>
                        <input  className='form-control' onChange={(e) => setItem ({...item, name:e.target.value}) }
                                type="text" name='iName'  value = {item.name}/>
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
                        <i className="bi bi-save2" style={{'font-size': '1.3rem', color: "#BD302D"}}
                           onClick={(e) => localUpdateIngredient(e)  }></i>
                    </div>

                    <div className='col-1'>
                        <i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
                           onClick={(e) => localCanselUpdate(e)}></i>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default IngredientUpdateForm