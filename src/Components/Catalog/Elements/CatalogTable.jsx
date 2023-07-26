import React from 'react';
import RowOfTable from "./RowOfTable";
import CatalogActionButton from "../ButtonAction/CatalogActionButton";

const CatalogTable = ({fieldsList, elementsList, catalogActionButton}) => {
    return (
        <div>
            <table className='table'>
                <thead  className='font-comfortaa'>
                    <tr>
                        { fieldsList.map (value =>
                            <td
                                key={value.fieldName}
                                className={`col-${value.width} text-${value.justify}`}
                            >
                                {value.fieldName}
                            </td>)
                        }
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody className='font-roboto'>
                    {elementsList.map((item,i) =>
                        <RowOfTable
                            key={i} item={item}
                            fieldsList={fieldsList}
                            catalogActionButton = {catalogActionButton}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CatalogTable;