const express = require('express');
const app= express();
const cors = require('cors');
const dotenv= require('dotenv');
const mongoose = require('mongoose');



// configure cors
app.use(cors());

// configure express to receive form data
app.use(express.json());

// configure dotenv
dotenv.config({path: "./.env"});

const port = process.env.PORT || 5000 ;

// configure mongodb connection
mongoose.connect(process.env.MONGO_DB_CLOUD_URL).then((response)=>{
    console.log('DataBase is connected successfully');
}).catch((error)=>{
    console.log(error);
    process.exit(1);
});

// simple request
app.get('/',(request,response)=>{
    response.send(`<h2>Welcome to the server of Online shopping Application</h2>`);
});

// router configuration
app.use('/api/users', require('./router/userRouter'));
app.use('/api/products',require('./router/productRouter'));
app.use('/api/orders',require('./router/orderRouter'));
app.use('/api/payments',require('./router/paymentRouter'));

app.listen(port,()=>{
    console.log(`Express Js server started at port :${port}`);
});