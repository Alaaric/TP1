import './style.css';


import axios from "axios";


const getCurrencies = async () => {

    try {
        const response = await axios.get(`https://api.freecurrencyapi.com/v1/currencies?apikey=${import.meta.env.VITE_API_KEY}`);
        return response.data.data;
    } catch (error) {
        return console.error('Error:', error);
    }
}

const selectToConvert = document.getElementById("currencyToConvert")
const selectConverted = document.getElementById("conertedCurrency")


const mapCurrencies = async (select) => {
    const currencies = Object.values(await getCurrencies());
    currencies.forEach(currency => {
        const option = new Option(currency.symbol, currency.symbol)
        select.appendChild(option)

    })


}

mapCurrencies(selectToConvert);
mapCurrencies(selectConverted);
