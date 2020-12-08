import express from 'express';
import { getProductDetails, getProductPrice, getProductOffers } from '../lib/util';
import { webSites } from '../configs';
import Joi from '@hapi/joi';
import { isEmpty } from 'Lodash'

const router = express.Router();

const validator = Joi.object({
  productName: Joi.string().required()
})

router.get('/', async (req, res) => {
  try{
    let response = {};
    const { error } = validator.validate(req.query);
    if (error) {
      throw ({ name: 'invalidInput' , message: error.details[0].message});
    }
  const { productName } = req.query;
  const productDetails = await getProductDetails(productName);
  if(isEmpty(productDetails)) throw({name: 'emptyResult', message:'No result found.'});
  response = productDetails;
  const productPrice = getProductPrice(productName);
  const productOffers = getProductOffers(productName);
  await Promise.all([productPrice, productOffers]).then((values) => {
    webSites.forEach((webSite) =>{
      response[webSite] = {price:values[0][webSite].price,offers:values[1][webSite].offers};
    });
    res.send(response);

  });
}catch(error){
  console.log(error);
  let statusCode = 500;
  let message = 'Internal server error.'
  switch(error.name){
    case 'emptyResult': statusCode = 200; message = error.message; break;
    case 'invalidInput': statusCode = 400; message = error.message; break;
    default: statusCode = 500; message = error.message; break;
  }
  res.status(statusCode).send(message);
}
});

export default router;
