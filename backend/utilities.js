import got from "got";
const getJsonFromWWWPromise =  (url) => got(url).json();
export{getJsonFromWWWPromise}