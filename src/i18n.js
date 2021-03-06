import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import Cookies from "js-cookie";

// let testlang = window.navigator.language; //.split("-")[0];
let testlang = window.navigator.language.split("-")[0];

const BASE_URL = process.env.REACT_APP_BASE_URL;
const loadpath = `${BASE_URL}gtas/api/translation/${testlang}`;

const backendOptions = {
  requestOptions: {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      Cookie: `JSESSIONID: ${Cookies.get("JSESSIONID")}`
    },
    credentials: "include"
  },
  loadPath: loadpath,
  parse: dataset => {
    let keyvals = {};

    JSON.parse(dataset).forEach(item => {
      keyvals[item["code"]] = item["translation"];
    });

    return keyvals;
  }
  // addPath: `/locales/${testlang}/{{ns}}`
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    // lng: "fr",
    // fallbackLng: "en",
    keySeparator: false,
    backend: backendOptions
    // debug: true
    // interpolation: { escapeValue: false }
  });

export default i18n;
