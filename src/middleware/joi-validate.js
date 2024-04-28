// const Joi = require('joi'); 
// const middleware = (schema, property) => { 
//   return (req, res, next) => { 
//   const { error } = Joi.validate(req.body, schema); 
//   const valid = error == null; 

//   if (valid) { 
//     next(); 
//   } else { 
//     // const { details } = error; 
//     // const message = details.map(i => i.message).join(',');

//     // console.log("error", message);
//     const message = 'body does not contain required fields' 
//    res.status(400).json({ error: message }) } 
//   } 
// } 
// module.exports = middleware;