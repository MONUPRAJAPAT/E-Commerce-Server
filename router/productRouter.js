const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {body,validationResult} = require('express-validator');
const Product = require('../models/Product');

/*
    @usage:Upload a Product
    @url:/api/products/upload
    @fields:name,brand,price,image,qty,category,description,usage
    @method : POST
    @access: PUBLIC
*/
router.post('/upload',authenticate,[
    body('name').notEmpty().withMessage('Name is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('image').notEmpty().withMessage('Price is required'),
    body('qty').notEmpty().withMessage('Qty is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('usage').notEmpty().withMessage('Usage is required')
],async (request,response)=>{
    let errors= validationResult(request);
    if (!errors.isEmpty()){
        return response.status(401).json({ errors: errors.array()});
    }
    try{
        let{name,brand,price,image,qty,category,description,usage}=request.body;
        let product = new Product({name,brand,price,image,qty,category,description,usage});
        product = await product.save();
        response.status(200).json({
            msg:'Product is uploaded',
            product:product
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});

/*
    @usage:get Men's collection
    @url:/api/products/men
    @fields:no fields
    @method : GET
    @access: PUBLIC
*/
router.get('/men',async (request,response)=>{
    try{
        let products = await Product.find({category:'MEN'});
        response.status(200).json({
            products:products
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});
/*
    @usage:get Women's collection
    @url:/api/products/women
    @fields:no fields
    @method : GET
    @access: PUBLIC
*/
router.get('/women',async (request,response)=>{
    try{
        let products = await Product.find({category:'WOMEN'});
        response.status(200).json({
            products:products
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});
/*
    @usage:get Kids' collection
    @url:/api/products/women
    @fields:no fields
    @method : GET
    @access: PUBLIC
*/
router.get('/kids',async (request,response)=>{
    try{
        let products = await Product.find({category:'KIDS'});
        response.status(200).json({
            products:products
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});
/*
    @usage:get a product
    @url:/api/products/:product_id
    @fields:no fields
    @method : GET
    @access: PUBLIC
*/
router.get('/:product_id',async (request,response)=>{
   try{
       let productId=request.params.product_id;
       let product = await Product.findById(productId);
       response.status(200).json({
           product:product
       });
   }
   catch (error){
       console.error(error);
       response.status(500).json({ errors:[{ msg:error.message}]});
   }
});
module.exports=router;