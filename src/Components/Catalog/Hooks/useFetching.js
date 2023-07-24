import {useDispatch} from "react-redux";
import {setLoader} from "../../../redux/action";
import {useState} from "react";

export const useFetching = (callBack) => {
    const dispatch = useDispatch();
    const [messageError, setMessageError] = useState('');
    const result = async (...args) => {

        try {
            dispatch(setLoader(true));
            await callBack (...args);
        } catch (e) {
            setMessageError(e.message);
        } finally {
            dispatch(setLoader(false));
        }
    }

    const clearMessageError = () => setMessageError('')

    return [result, messageError, clearMessageError];
}

