import './style.scss';
import axios from "axios";


const getCurrencies = async () => {

  try {
    const response = await axios.get(`https://api.freecurrencyapi.com/v1/currencies?apikey=${import.meta.env.VITE_API_KEY}`);
    return response.data.data;
  } catch (error) {
    return console.error('Error:', error);
  }
};

const selectToConvert = document.getElementById("currencyToConvert")
const selectConverted = document.getElementById("convertedCurrency")


const mapCurrencies = async (select) => {
  const currencies = Object.values(await getCurrencies());
  currencies.forEach(currency => {
    const option = new Option(currency.symbol, currency.code)
    select.appendChild(option)

  })


};

mapCurrencies(selectToConvert);
mapCurrencies(selectConverted);



const getUserCurrency = (selected) => {

  return selected.value;

};

const getCurrenciesRatio = async (targetCurrency, sourceCurrency) => {

  try {
    const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${import.meta.env.VITE_API_KEY}&currencies=${targetCurrency}&base_currency=${sourceCurrency}`);
    return response.data.data;
  } catch (error) {
    return console.error('Error:', error);
  }
};

const form = document.getElementById("convertionForm");

const handleconvert = async () => {
  let targetCurrency = getUserCurrency(selectConverted);
  let sourceCurrency = getUserCurrency(selectToConvert);
  const resultDiv = document.getElementById("result");
  const amount = document.getElementById("amount").value;
  const ratio = await getCurrenciesRatio(targetCurrency, sourceCurrency);
  let finalValue = Math.round((ratio[targetCurrency] * amount + Number.EPSILON)  * 100) / 100

  resultDiv.innerText = `${finalValue} ${targetCurrency}`;

};

form.addEventListener("submit", (e) => {
  e.preventDefault;

  handleconvert();
})

let checkbox = document.querySelector('input[name=mode]');

checkbox.addEventListener('change', function() {
    if(this.checked) {
        trans()
        document.documentElement.setAttribute('data-theme', 'dark')
    } else {
        trans()
        document.documentElement.setAttribute('data-theme', 'light')
    }
})

let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
    }, 1000)
}
