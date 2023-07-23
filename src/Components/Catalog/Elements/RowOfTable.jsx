import React from "react";

const RowOfTable = ({fieldsList, item, editButton, pushDeactivateButton}) => {
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

            <td className='align-middle text-center '>
                <i className="bi bi-pencil" style={{'fontSize': '1.3rem', color: "#BD302D"}}
                   onClick={() => editButton(item)}>

                </i>
            </td>

            <td className='align-middle text-center '>
                <i className="bi bi-x-square" style={{fontSize: '1.3rem', color: "#BD302D"}}
                   onClick = { () => pushDeactivateButton(item) }>

                </i>
            </td>

        </tr>
    )
}

export default RowOfTable;