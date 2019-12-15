const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const server = require('../server');
const io = require('./socket');
const multer = require('multer');
const exclusive_discounted_deals_routes =  require('./routes/exclusive-discounted-deals');
const pizza_routes = require('./routes/pizza');
const snacks_routes = require('./routes/snacks');
const auth_routes = require('./routes/auth');
const user_cart =  require('./routes/cart_order')
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'backend/images');
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.split(' ').join('-');
        cb(null,new Date().getMilliseconds().toString()+'-'+name);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg' ){
        cb(null,true);
    }else{
        cb(null,false);
    }
}


mongoose.connect("mongodb+srv://hamza:"+process.env.MONGO_ATLAS_PW+"@cluster0-qfsms.mongodb.net/Shop?retryWrites=true&w=majority").then((result)=>{
    if(!result){
        throw new Error('Check the Internet Connection');
    }
    console.log('Connected');
    const websocket_server= server.server.listen(server.port);
    const io = require('./socket').init(websocket_server);
    
    io.on('connection',(socket)=>{
        
    })
}).catch((err)=>{
    console,log(err);
    throw err;
})


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT ,OPTIONS ');
    next();
});


app.use(bodyParser.json()); 
app.use("/images",express.static(path.join(__dirname,"/images")));
app.use(
    multer({storage:fileStorage,fileFilter:fileFilter}).single('imagePath')
);

app.use('/api/auth',auth_routes);
app.use('/api/exclusive-discounted-deals',exclusive_discounted_deals_routes);
app.use('/api/pizza',pizza_routes);
app.use('/api/snacks',snacks_routes);
app.use('/api/cart_orders',user_cart);

app.use((error,req,res,next)=>{
    if(!error.statusCode){
        console.log(error);
        error.statusCode = 500;
    }
    else if(!error.message){
        error.message = 'Fail due to some issue. Kindly Try again.'
    }
    else if(error.product_data){
        console.log(error);
        res.status(error.statusCode).json({message:error.message,product_data:error.product_data});
    
    }
    else{
        console.log(error);
        res.status(error.statusCode).json({message:error.message+' or Check your Internet Connection.'});}
    
    
})

module.exports = app;