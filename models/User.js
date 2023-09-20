const mongoose = require('mongoose');

let  UserSchema=new mongoose.Schema({
    name: {type:String , require:true},
    email: {type:String , require:true},
    password: {type:String , require:true},
    avatar: {type:String , require:true},
    isAdmin: {type:Boolean , default:false},
    address: {
        flat:{type:String , require:true},
        street:{type:String , require:true},
        landmark:{type:String , require:true},
        city:{type:String , require:true},
        state:{type:String , require:true},
        country:{type:String , require:true},
        pin:{type:String , require:true},
        mobile:{type:String , require:true},
    }
},{timestamps:true});

const User = mongoose.model('user',UserSchema);
module.exports=User;