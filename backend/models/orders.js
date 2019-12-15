const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const order_schema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{type:String,required:true},
    delivery:{type:String,required:true},
    orders:[
        {
            name:{type:String,required:true},
            quantity:{type:Number,required:true}
        }
    ],
    TotalPrice:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Order',order_schema);