// see joi website and see code written there how to use joi

// basically agar koi devloper banda hopscotch ya postman se chahe to wo form me ek ya do chiz fill krke baki khali chodkar submit kar sakta hai
// OR postman or hopscotch se khali form bhi submit ho sakta hai 
// aur koi error bhi nhi ayga ki form pura bharo aisa, bcoz wo server side se form bhar rha and hamne sirf client side(ie:webpage) se koi khali form na bhare wo handle kiya hai

// therefore it is also important to handle schema validation from server side 
// and joi do this work

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    // No more "listing" object, just the fields directly
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null)
});