import "./styles.scss";
import axios from "axios";

// global variables declaration
const selectToConvert = document.getElementById("currencyToConvert");
const selectConverted = document.getElementById("convertedCurrency");
const form = document.getElementById("convertionForm");
const resultDiv = document.getElementById("result");
const keyToInputIdMap = {
  amount: "amount",
  sourceCurrency: "currencyToConvert",
  targetCurrency: "convertedCurrency",
  displayedResult: "result",
};
let checkbox = document.querySelector("input[name=mode]");

// get all currencies from API and populate dynamically options tags in both select tags with call result
const getCurrencies = async () => {
  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/currencies?apikey=${
        import.meta.env.VITE_API_KEY
      }`
    );
    const data = response.data.data;
    localStorage.setItem("apiDataResult", JSON.stringify(data));
    return data;
  } catch (error) {
    return console.error("Error:", error);
  }
};

const mapCurrencies = async (select) => {
  let currencies;
  const storedApiResult = localStorage.getItem("apiDataResult");
  if (storedApiResult) {
    const parsedApiData = JSON.parse(storedApiResult);

    currencies = Object.values(parsedApiData);
  } else {
    currencies = Object.values(await getCurrencies());
  }

  currencies.forEach((currency) => {
    const option = new Option(currency.symbol, currency.code);
    select.appendChild(option);
  });
};

mapCurrencies(selectToConvert);
mapCurrencies(selectConverted);

// populate inputs fields from localStorage if not empty
(function fillElementsFromLocalStorage(mapping) {
  Object.keys(mapping).forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      const inputId = mapping[key];
      const element = document.getElementById(inputId);
      if (element) {
        element.tagName.toLocaleLowerCase() === "p"
          ? (element.innerText = value)
          : (element.value = value);
      }
    }
  });
})(keyToInputIdMap);

// convert the amout of a currency to another, display result and store all datas used and result in localStorage
const handleconvert = async (resultDiv) => {
  let targetCurrency = getUserCurrency(selectConverted);
  localStorage.setItem("targetCurrency", targetCurrency);

  let sourceCurrency = getUserCurrency(selectToConvert);
  localStorage.setItem("sourceCurrency", sourceCurrency);

  const amount = document.getElementById("amount").value;
  localStorage.setItem("amount", amount);

  const ratio = await getCurrenciesRatio(targetCurrency, sourceCurrency);
  let finalValue =
    Math.round((ratio[targetCurrency] * amount + Number.EPSILON) * 100) / 100;
  let displayedResult = `${finalValue} ${targetCurrency}`;
  localStorage.setItem("displayedResult", displayedResult);

  resultDiv.innerText = displayedResult;
};

const getUserCurrency = (selected) => {
  return selected.value;
};

form.addEventListener("submit", (e) => {
  e.preventDefault;

  handleconvert(resultDiv);
});

//API call to get exchange rate between two currencies
const getCurrenciesRatio = async (targetCurrency, sourceCurrency) => {
  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${
        import.meta.env.VITE_API_KEY
      }&currencies=${targetCurrency}&base_currency=${sourceCurrency}`
    );
    return response.data.data;
  } catch (error) {
    return console.error("Error:", error);
  }
};

// light/dark theme switch logic and store this information in localStorage + apply it
checkbox.addEventListener("change", function () {
  if (this.checked) {
    transition();
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("data-theme", "dark");
  } else {
    transition();
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("data-theme", "light");
  }
});

let transition = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 1000);
};

(function applyThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem("data-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    checkbox.checked = savedTheme === "dark" && true;
  }
})();
