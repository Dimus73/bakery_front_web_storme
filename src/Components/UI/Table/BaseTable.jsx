import React from 'react';
import RowOfTable from "./RowOfTable";
// import CatalogActionButton from "../ButtonAction/CatalogActionButton";

const BaseTable = ({fieldsList, elementsList, catalogActionButton}) => {
    // console.log('Before return =>', fieldsList);
    return (
        <div>
            <table className='table'>
                <thead  className='font-comfortaa'>
                    <tr>
                        { fieldsList.map (value =>
                            <th
                                key={value.fieldName}
                                className={`col-${value.width} text-${value.justify}`}
                            >
                                {value.fieldName}
                            </th>)
                        }
                    </tr>
                </thead>
                <tbody className='font-roboto'>
                    {elementsList.map((item,i) =>
                    { if (item)
                        return (<RowOfTable
                            key={i} item = {{...item,i}}
                            fieldsList = {fieldsList}
                            catalogActionButton = {catalogActionButton}
                        />)
                    }
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BaseTable;