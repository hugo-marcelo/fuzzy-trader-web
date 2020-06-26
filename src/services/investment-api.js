import axios from "axios";

const investimentApi = axios.create();

investimentApi.getCurrencyValue = async (code) => {
  let convertedValue = localStorage.getItem(code) || 0;

  if (code === "BTC") {
    await investimentApi
      .get("https://blockchain.info/tobtc?currency=USD&value=1")
      .then((res) => {
        convertedValue = Math.floor(1 / res.data, 2);
        localStorage.setItem(code, convertedValue);
      });
  } else {
    var code_extensive = "";

    if (code === "ETH") code_extensive = "ethereum";
    else if (code === "XRP") code_extensive = "ripple";

    await investimentApi
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=" +
          code_extensive +
          "&vs_currencies=usd"
      )
      .then((res) => {
        convertedValue = res.data[code_extensive].usd;
        localStorage.setItem(code, convertedValue);
      });
  }

  return convertedValue;
};

investimentApi.getStockValue = async (code) => {
  let stockValue = localStorage.getItem(code) || 0;

  await investimentApi
    .get(
      "https://finnhub.io/api/v1/quote?symbol=" +
        code +
        "&token=brr0iffrh5r9994jlgc0"
    )
    .then((res) => {
      stockValue = res.data.c;
      localStorage.setItem(code, stockValue);
    });

  return stockValue;
};

export default investimentApi;
