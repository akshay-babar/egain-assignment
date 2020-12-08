import { get } from './crawler';
import { webSites, baseUrl } from '../configs';
export const getProductDetails = async (productName) => {
    const response = await get(`${baseUrl}product/details`,productName);
    return response.data;
}


export const getProductPrice = async (productName) => {
    const productPriceByWebSite = {};
    let apiCalls = webSites.map(webSite => get(`${baseUrl}product/${webSite}`,productName));
    await Promise.all(apiCalls).then((values) => {
       webSites.map((webSite, index) => {
           productPriceByWebSite[webSite] = values[index].data;
       });
      });
    return productPriceByWebSite;
}

export const getProductOffers = async (productName) => {
    const productOffersByWebSite = {};
    let apiCalls = webSites.map(webSite => get(`${baseUrl}offers/${webSite}`,productName));
    await Promise.all(apiCalls).then((values) => {
        webSites.map((webSite, index) => {
            productOffersByWebSite[webSite] = values[index].data;
        });
       });
     return productOffersByWebSite;
}