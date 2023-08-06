import axios from "axios";
import {EDIT_MODE} from "../utils/createTaskMode";
const BASE_URL = process.env.REACT_APP_BASE_URL + '/api/'

export default class TaskServiceAPI {
    static async getRecipeList ( token ) {
        const response = await axios.get (BASE_URL + 'recipe/',
            {
                headers : {
                    Authorization : "Bearer " + token,
                }
            });
        return response.data;
    }

    static async getTask( id, token) {
        const response = await axios.get (BASE_URL + 'task/' + id,
            {
                headers : {
                    Authorization : "Bearer " + token,
                }

            });
        return response.data;
    }

    static async saveTask ( id, token, mode, data) {

       const response = await axios ( {
            method : mode === EDIT_MODE.CREATE ? 'POST' : 'PUT',
            url : BASE_URL + 'task/',
            headers : {
                Authorization : "Bearer " + token,
            },
           data,
       });
        return response.data;
    }

    static async getResource (id, token) {
        const response = await axios.get ( BASE_URL + 'task/resource/' + id,
            {
                headers : {
                    Authorization : "Bearer " + token,
                }

        })
        return response;
    }
}