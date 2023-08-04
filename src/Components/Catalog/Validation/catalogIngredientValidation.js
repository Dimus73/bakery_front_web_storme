const checkSQLReservWord = require ('./checkSQLReservWord');

export default class CatalogIngredientValidation {
    static dataValidation = (name, unit_id, messageAlert) => {
        // console.log('dataValidation =>', name, unit_id)

        if ( checkSQLReservWord(name) ) {
            messageAlert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
        } else if (!name){
            messageAlert ("The Ingredient field cannot be empty")
        } else if (unit_id == 1){
            messageAlert ("Choose a unit of measure") ;
        } else {
            return true;
        }
        return false;
    }

    static nameUpdateValidation = (id, name, ingredients, messageAlert) => {
        if ( ingredients.some ((value) => (value.name.toLowerCase() === name.toLowerCase() && value.id !== id)) ){
            messageAlert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
        } else {
            return true;
        }
        return false;
    }

    static 	nameAddValidation = (name, ingredients, messageAlert) => {
        // console.log('nameAddValidation =>', name, ingredients)
        if ( ingredients.some ((value) => (value.name.toLowerCase() === name.toLowerCase())) ){
            messageAlert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
        } else {
            return true;
        }
        return false;
    }

}