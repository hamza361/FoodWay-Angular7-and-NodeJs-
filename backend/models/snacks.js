const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const snacks_schema = new Schema({
    name:{type:String,required:true},
    imagePath:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true}

});

module.exports = mongoose.model('Snack', snacks_schema);