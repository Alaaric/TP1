import "./style.scss";
import axios from "axios";

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

const selectToConvert = document.getElementById("currencyToConvert");
const selectConverted = document.getElementById("convertedCurrency");

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

const getUserCurrency = (selected) => {
  return selected.value;
};

const form = document.getElementById("convertionForm");
const resultDiv = document.getElementById("result");
const keyToInputIdMap = {
  amount: "amount",
  sourceCurrency: "currencyToConvert",
  targetCurrency: "convertedCurrency",
  displayedResult: "result",
};

const fillElementsFromLocalStorage = (mapping) => {
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
};

fillElementsFromLocalStorage(keyToInputIdMap);

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

form.addEventListener("submit", (e) => {
  e.preventDefault;

  handleconvert(resultDiv);
});

let checkbox = document.querySelector("input[name=mode]");

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

function applyThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem("data-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    checkbox.checked = savedTheme === "dark" && true;
  }
}

applyThemeFromLocalStorage();
