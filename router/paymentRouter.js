const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const Razorpay = require('razorpay');

/*
    @usage:make a payment
    @url:/api/payments/pay
    @fields:no fields
    @method : POST
    @access: PRIVATE
*/

router.post('/pay',authenticate, async (request, response) => {
   try{
      let instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
      let options={
         amount: request.body.amount *100,
         currency: "INR",
      }
      const order= await instance.orders.create(options);
      response.send(order);
   }
   catch (error){
      response.send(error);
   }
});

module.exports=router;