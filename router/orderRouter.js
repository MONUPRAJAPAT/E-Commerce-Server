const express = require('express');
const router = express.Router();
const {body,validationResult}=require('express-validator');
const authenticate= require('../middlewares/authenticate');
const User = require('../models/User');
const Order = require('../models/Order');

/*
    @usage:place an order
    @url:/api/orders/
    @fields: total,tax,items
    @method : POST
    @access: PUBLIC
*/
router.post('/',authenticate,[
    body('total').notEmpty().withMessage('Total is required'),
    body('tax').notEmpty().withMessage('Tax is required'),
    body('items').notEmpty().withMessage('Items is required')
],async (request,response)=>{
    let errors= validationResult(request);
    if (!errors.isEmpty()){
        return response.status(401).json({ errors: errors.array()});
    }
   try{
        let {total,tax,items}=request.body;
        let user= await User.findById(request.user.id);
        let order= new Order ({
            name: user.name,
            email: user.email,
            mobile: user.address.mobile,
            total:total,
            tax:tax,
            items:items
        })
        order = await order.save();
        response.status(200).json({
           msg:'Order is placed successfully',
           order: order
        });
   }
   catch (error){
       response.status(500).json({ errors:[{ msg:error.message}]});
   }
});
/*
    @usage:get all the orders
    @url:/api/orders/list
    @fields: No fields
    @method : GET
    @access: PRIVATE
*/
router.get('/list',authenticate,async (request,response)=>{
    try{
        let user = await User.findById(request.user.id);
        let orders= await Order.find({email:user.email});
        response.status(200).json({
           orders : orders
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});
module.exports=router;