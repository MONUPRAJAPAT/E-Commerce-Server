const express = require('express');
const router = express.Router();
const {body,validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { AvatarGenerator } = require('random-avatar-generator');
const jwt= require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');

/*
    @usage:Register a user
    @url:/api/users/register
    @fields:name,email,password
    @method : POST
    @access: PUBLIC
*/

router.post('/register',[
    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword is required')

], async (request,response)=>{
    let errors= validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({ errors: errors.array()});
    }
    try{
       // check if the user exist or not
        let {name,email,password}=request.body;
        let user = await User.findOne({email:email});
        if (user){
           return response.status(501).json({ errors:[ {msg:'user already exists'}]});
        }

        // encode the password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);

        // generate random avatar
        const generator = await new AvatarGenerator();
        const avatar= await generator.generateRandomAvatar('avatar');

        // address
        let address={
            flat:' ',
            street:' ',
            landmark:' ',
            city:' ',
            state:' ',
            country:' ',
            pin:' ',
            mobile:' '
        };

        // save to the database
        user = new User({name,email,password,avatar,address});
        user = await user.save();
        response.status(200).json({ msg: 'Registration is Successful'});
    }
    catch (error){
      response.status(500).json({ errors:[{ msg:error.message}]});
    }
});

/*
    @usage:Login a user
    @url:/api/users/login
    @fields:email,password
    @method : POST
    @access: PUBLIC
*/

router.post('/login',[
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required')
],async (request,response)=>{
    let errors= validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({ errors: errors.array()});
    }
    try{
        let {email,password}=request.body;
        let user = await User.findOne({email:email});
        if(!user){
            return response.status(401).json({ errors:[{ msg:"Invalid Credentials"}]});
        }
       let isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(401).json({ errors:[{ msg:"Invalid Credentials"}]});
        }
        let payload={
           user:{
               id:user.id,
               password:user.password
           }
        }
        jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn: 360000},(err,token)=>{
            response.status(200).json({
                msg:'Login is Success',
                token:token
            });
        });
    }
    catch (error){
        response.status(500).json({ errors:[{ msg:error.message}]});
    }
});

/*
    @usage:Get user info
    @url:/api/users/
    @fields: Empty
    @method : GET
    @access: PRIVATE
*/

router.get('/',authenticate,async (request,response)=>{
    try{
       let user = await User.findById(request.user.id).select('-password');
       response.status(200).json({
          user: user
       });
    }
    catch (error){
        response.status(401).json({ errors:[{ msg:error.message}]});
    }
});


/*
    @usage:Update an Address
    @url:/api/users/address
    @fields: flat,street,landmark,city,state,country,pin,mobile
    @method : POST
    @access: PRIVATE
*/
router.post('/address', authenticate,[
    body('flat').notEmpty().withMessage('Flat is required'),
    body('street').notEmpty().withMessage('Street is required'),
    body('landmark').notEmpty().withMessage('Landmark is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('pin').notEmpty().withMessage('pin is required'),
    body('mobile').notEmpty().withMessage('Mobile is required')
], async (request,response)=>{
    let errors= validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({ errors: errors.array()});
    }
   try{
       let user=await User.findById(request.user.id);
       let address={
           flat:request.body.flat,
           street:request.body.street,
           landmark:request.body.landmark,
           city:request.body.city,
           state:request.body.state,
           country:request.body.country,
           pin:request.body.pin,
           mobile:request.body.mobile
       }
       user.address= address;
       user = await user.save();
       response.status(200).json({
           msg:"Address is updated",
           user:user
       });

   }
   catch (error){
       response.status(401).json({ errors:[{ msg:error.message}]});
   }
});

module.exports=router;