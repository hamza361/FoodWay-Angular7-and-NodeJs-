const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    name:{type:String, required:true},
    contact:{type:String,required:true ,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    
   cart:{ 
       items:[
            {
                productId:{type:Schema.Types.ObjectId,required:true},
                name:{type:String,required:true},
                quantity:{type:Number,required:true},
                price:{type:Number,required:true}
            }
        ],
        TotalPrice:{type:Number,required:true},
           
    },
    resetToken:{type:String},
    resetTokenExpiration:{type:Date}
   
})

user_schema.plugin(uniqueValidator);
module.exports = mongoose.model('User',user_schema);