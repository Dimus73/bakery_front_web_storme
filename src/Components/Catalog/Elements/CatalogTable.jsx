import React from 'react';
import RowOfTable from "./RowOfTable";

const CatalogTable = ({fieldsList, elementsList, pushEditButton, pushDeactivateButton}) => {
    // console.log('**************************************')
    // console.log('IngredientsTable =>', fieldsList, equipmentsFiltered)
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
                            editButton = {pushEditButton}
                            pushDeactivateButton = {pushDeactivateButton}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CatalogTable;