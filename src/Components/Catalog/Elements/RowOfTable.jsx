import React from "react";
import CatalogActionButton from "../ButtonAction/CatalogActionButton";

const RowOfTable = ({fieldsList, item, catalogActionButton}) => {
    return (
        <tr>
            {fieldsList.map(value =>
                <td
                    key={value.fieldName}
                    className={`col-${value.width} text-${value.justify}`}
                >
                    {item[value.fieldNameInList]}
                </td>)
            }

            <td className='align-middle  text-end'>
                <i className="bi bi-pencil" style={{'fontSize': '1.3rem', color: "#BD302D"}}
                   onClick={() => catalogActionButton.pushEditButton(item)}>

                </i>
            </td>

            <td className='align-middle text-end'>
                <i className="bi bi-x-square" style={{fontSize: '1.3rem', color: "#BD302D"}}
                   onClick = { () => catalogActionButton.pushDeactivateButton(item) }>

                </i>
            </td>

        </tr>
    )
}

export default RowOfTable;