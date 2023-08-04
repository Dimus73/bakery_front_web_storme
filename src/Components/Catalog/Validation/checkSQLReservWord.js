function checkSQLReservWord (data) {
    console.log('Check SQL')
    const checkWord = ['SELECT', 'INSERT', 'DELETE', 'UPDATE'];
    if (checkWord.some ((value) => data.toLowerCase().indexOf(value.toLowerCase()) !== -1)){
        console.log('True');
        return true;
    }
    console.log('false');
    return false;
}

module.exports = checkSQLReservWord;