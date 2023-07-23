import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export default class CatalogEquipmentService {

    static async allEquipments ( token ) {
        const response = await axios.get(BASE_URL+'/api/catalog/equipment1',
            {
                headers:{
                    Authorization : "Bearer " + token
                }
            });
        return response.data;
    }
}