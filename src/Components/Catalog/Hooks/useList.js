import {useMemo} from "react";

export const useList = (itemList, workingFieldName, searchStr) => {

    const filteredList = useMemo ( () =>
            itemList.filter((value) =>
                searchStr ?
                value[workingFieldName].toLowerCase().indexOf( searchStr.toLowerCase() )  !== -1
                :
                true)
        , [itemList, searchStr]);

    return filteredList;
}