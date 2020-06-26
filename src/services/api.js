import axios from "axios";

const api = axios.create({
  baseURL: "https://fuzzy-trader-api.herokuapp.com",
});

export default api;
