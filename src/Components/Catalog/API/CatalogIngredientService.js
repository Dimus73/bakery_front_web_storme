import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL + '/api/catalog/';
export default class CatalogIngredientService {
    static async allIngredient ( token ) {
        const response = await axios.get(BASE_URL + 'ingredients',
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }

    static async allUnits ( token ) {
        const response = await axios.get(BASE_URL + 'units',
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }

    static async addIngredient (data, token) {
        const response = await axios.post( BASE_URL + 'ingredients', data,
            {
               headers : {
                   Authorization : "Bearer " + token
               }
            });
        return response.data;
    }

    static async updateIngredient (data, token) {
        const response = await axios.put( BASE_URL + 'ingredients', data,
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }
}