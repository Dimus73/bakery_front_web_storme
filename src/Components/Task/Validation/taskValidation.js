export default class TaskValidation {

    // ---------------------------
    // Clearing data before sending it to the server
    // ---------------------------
    static clearData = (task) => {
        const data = {...task};
        data.taskList = data.taskList.filter((value) => 'id' in value)
        return data
    }

    // ---------------------------
    // Control data before sending it to the server
    // ---------------------------
    static taskDataCheck = (data, messageAlert) => {
        if ( data.taskList.length === 0 ) {
            messageAlert ('The task must contain at least one recipe')
            return false;
        }
        if (data.taskList.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
            messageAlert ('In the quantity field must be a number greater than zero')
            return false;
        }
        return true;

    }
}