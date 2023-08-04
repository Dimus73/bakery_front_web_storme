import React from "react";
// import CatalogActionButton from "../ButtonAction/CatalogActionButton";
import {tableFieldType} from "./tableFieldType";
import {tableActionType} from "./tableActionsType";
import login from "../../Auth/Login";

const RowOfTable = ({fieldsList, item, catalogActionButton}) => {
    return (
        <tr>
            {fieldsList.map(value => {
                // console.log('Before switch =>', value);
                switch (value.fieldType){
                    case (tableFieldType.TEXT_FIELD):
                        return (
                            <td
                                key={value.fieldName}
                                className={`col-${value.width} text-${value.justify}`}
                            >
                                {item[value.fieldNameInList]}
                            </td>)

                    case (tableFieldType.SELECT_FIELD):
                        return (
                            <td className={`col-${value.width} text-${value.justify}`} >
                                <select
                                    name={value.fieldNameInList} id=""
                                    value={item[value.fieldNameInList]}
                                    onChange={(e) => value.action(e,item.i)} >
                                        <option value="" disabled selected ></option>
                                        {value.selectItemList.map ( ( value,i ) =>
                                            <option key={i} value={value.id} >{value.name}</option>)}
                                </select>
                            </td>
                        )

                    case (tableFieldType.ENTER_FIELD):
                        return (
                            <td className={`col-${value.width}`}>
                                <input
                                    className={`text-${value.justify} w-100`}
                                    type = "text"
                                    name = {value.fieldNameInList}
                                    value = {item.quantity}
                                    onChange={(e) => value.action (e, item.i)} />
                            </td>

                        )

                    case (tableFieldType.ACTION_FIELD):
                        // console.log('****** ACTION_FIELD **********', value.actionType, tableActionType.REMOVE)
                        if (value.actionType === tableActionType.EDIT){
                            return (
                                <td className='align-middle  text-end'>
                                    <i className="bi bi-pencil" style={{'fontSize': '1.3rem', color: "#BD302D"}}
                                       onClick={() => value.action(item)}>
                                    </i>
                                </td>
                            )
                        } else if (value.actionType === tableActionType.REMOVE) {
                            // console.log('****** tableActionType.REMOVE **********')
                            return (
                                <td className='align-middle text-end'>
                                    <i className="bi bi-x-square" style={{fontSize: '1.3rem', color: "#BD302D"}}
                                       onClick = { () => {
                                           console.log('Action function:', value.action);
                                           value.action(item)
                                       } }>
                                    </i>
                                </td>
                            )
                        }
                }

             })
            }

        </tr>
    )
}

export default RowOfTable;