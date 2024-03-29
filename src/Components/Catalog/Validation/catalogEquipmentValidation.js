const checkSQLReservWord = require ('./checkSQLReservWord');

export default class CatalogEquipmentValidation {
    static dataValidation = (name, quantity, messageAlert) => {
        if (checkSQLReservWord(name)) {
            messageAlert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
        } else if (!name){
            messageAlert ("The Equipment field cannot be empty")
        } else if (!quantity){
            messageAlert ("The Quantity field cannot be empty")
        } else {
            return true;
        }
        return false;
    }

    static nameUpdateValidation = (id, name, equipments, messageAlert) => {
        if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase() && value.id !== id)) ){
            messageAlert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
        } else {
            return true;
        }
        return false;
    }

    static 	nameAddValidation = (name, equipments, messageAlert) => {
        if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase())) ){
            messageAlert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
        } else {
            return true;
        }
        return false;
    }

}