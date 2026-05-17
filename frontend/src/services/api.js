import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export default API;
