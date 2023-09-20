const mongoose = require('mongoose');
let OrderSchema= new mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true},
    mobile:{type:String, require:true},
    total:{type:String, require:true},
    tax:{type:String, require:true},
    items: [
        {
            name:{type:String, require:true},
            brand:{type:String, require:true},
            price:{type:Number, require:true},
            qty:{type:Number, require:true},
        }
    ]
},{timestamps:true});

const Order = mongoose.model('oder',OrderSchema);
module.exports=Order;