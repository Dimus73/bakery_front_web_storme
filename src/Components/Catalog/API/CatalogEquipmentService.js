import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL + '/api/catalog/';
export default class CatalogEquipmentService {
    static async allEquipments ( token ) {
        const response = await axios.get(BASE_URL + 'equipment',
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }

    static async addEquipment (data, token) {
        const response = await axios.post( BASE_URL + 'equipment', data,
            {
               headers : {
                   Authorization : "Bearer " + token
               }
            });
        return response.data;
    }

    static async updateEquipment (data, token) {
        const response = await axios.put( BASE_URL + 'equipment', data,
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }
}