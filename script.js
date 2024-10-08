const axios = require('axios');

let currencies = {};

const getCurrencies = () => {
    axios.get("https://api.freecurrencyapi.com/v1/status?apikey=fca_live_gfjO3WdarRrBjLavsKOmkrvnQXKm26ZZObQh1krt")
.then((res) => currencies = res )
}
getCurrencies();
console.log(currencies);


