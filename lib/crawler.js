import axios from 'axios';
export const get = (url, productName)=>{  
    return axios({
    method: 'get',
    url: `${url}?productName=${productName}`,
    headers: { 'accept': 'application/json',
    'accept-language': 'en-us'},
});
};