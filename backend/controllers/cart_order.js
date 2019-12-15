const User = require('../models/signup');
const Pizza_Products = require('../models/pizza');
const Snack_Products = require('../models/snacks');
const Exclusive_Discounted_Products = require('../models/exclusice-discounted-deals');
const Order = require('../models/orders');
const path = require('path');
const io = require('../socket');
let PDFDocument = require('pdfkit');
const fs = require('fs');

exports.getCart = (req,res,next)=>{
    const userId = req.userId;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
       
        res.status(200).json({items:user.cart.items,TotalPrice:user.cart.TotalPrice});
   
    }).catch((error)=>{
        next(error);
    })
}
exports.postCart = (req,res,next)=>{
    const userId = req.userId;
    const productId = req.body._id;
    const category = req.body.category;
    let result;
    if(category==='exclusive-discounted-deals'){
        Exclusive_Discounted_Products.findOne({_id:productId}).select('name price').then((product)=>{
            if(!product){
                const error = new Error('Product Not Found');
                error.statusCode = 401;
                throw error;
            }
            const productPrice = +product.price;
            const productName = product.name;
            addToCart(userId,productId,productName,productPrice,res,next);
        

        }).catch((error)=>{
            next(error);
        })
    }
    else if(category==='pizza'){
        Pizza_Products.findOne({_id:productId}).then((product)=>{
            if(!product){
                const error = new Error('Product Not Found');
                error.statusCode = 401;
                throw error;
            }
            const productPrice = +product.price;
            const productName = product.name;
            addToCart(userId,productId,productName,productPrice,res,next);


        }).catch((error)=>{
            next(error);
        })
    }
    else if(category==='snacks'){
        Snack_Products.findOne({_id:productId}).then((product)=>{
            if(!product){
    
                const error = new Error('Product Not Found');
                error.statusCode = 401;
                throw error;
            }
            const productPrice = +product.price;
            const productName = product.name;
            addToCart(userId,productId,productName,productPrice,res,next);
        
        
        }).catch((error)=>{
            next(error);
        })
    }
   
}

addToCart = (userId,productId,productName,productPrice,res,next)=>{
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('User Not Found');
            error.statusCode = 401;
            throw error;
        }
        const index = user.cart.items.findIndex((p)=>{
           return  p.productId.toString() === productId.toString();
        })

        if(index>=0){
           
            user.cart.TotalPrice+=productPrice;
            user.cart.items[index].quantity+=1;
        }else{
            const newProduct = {productId:productId,name:productName,quantity:1,price:productPrice};
            user.cart.TotalPrice+=productPrice;
            user.cart.items.push(newProduct);
        }
        return user.save();
    }).then((user)=>{
        if(!user){
            const error = new Error('Fail to save.kindly try again.');
            error.statusCode = 401;
            throw error;
        }
        return res.status(201).json({message:'Added Successfully.',items:user.cart.items,TotalPrice:user.cart.TotalPrice}); 
    }).catch((error)=>{
        res.status(402).json({message:error.message});
    })
}


exports.postCartDelete = (req,res,next)=>{
    const userId = req.userId;
    const productId = req.body.productId;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const product = user.cart.items.find((p)=>{
           return  p.productId.toString() === productId.toString();
        })
        user.cart.items = user.cart.items.filter((p)=>{
            return p.productId.toString() !== productId.toString(); 
        })

        user.cart.TotalPrice = user.cart.TotalPrice - (product.price*product.quantity);
        return user.save();

    }).then((user)=>{
        if(!user){
            const error = new Error('Kindly Try again.');
            error.statusCode = 304;
            throw error;
        }
        res.status(200).json({items:user.cart.items,TotalPrice:user.cart.TotalPrice});
    }).catch((error)=>{
        next(error);
    })
}

exports.postOrder = (req,res,next)=>{
    const userId = req.userId;
    const address = req.address;
    let a;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const items = user.cart.items;
        const TotalPrice = user.cart.TotalPrice;
        const orders = items.map((p)=>{
            return {name:p.name,quantity:p.quantity}
        })
        a = user;
        const order = new Order({userId:userId,status:'Not Accepted',orders:orders,TotalPrice:TotalPrice,address:address,delivery:'Not Started Yet.'});
        return order.save()

    }).then((order)=>{
        if(!order){
            const error = new Error('Kindly Try again.');
            error.statusCode = 304;
            throw error;
        }
        a.cart = {items:[],TotalPrice:0};
        a.save();
        Order.findOne({_id:order._id}).populate('userId','cart contact name').then((populatedorder)=>{
            if(!order){
                const error = new Error('Order not Found');
                error.statusCode = 404;
                throw error;
            }  
            io.getIO().emit('products',{action:'newOrder',order:populatedorder});
            res.status(200).json({message:'Ordered Successfully.',order:order});
        })
      
      
    }).catch((error)=>{
        next(error);
    })
    
}

exports.getUserOrders = (req,res,next)=>{
    const userId = req.userId;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        Order.find({userId:userId}).then((orders)=>{
            res.status(200).json({orders:orders});
        })
    }).catch((error)=>{
        next(error);
    })
}

exports.getAdminOrders = (req,res,next)=>{
    const userId = req.userId;
    
       
    Order.find().populate('userId','cart contact name').then((orders)=>{
        
            res.status(200).json({orders:orders});
    })
    .catch((error)=>{
        next(error);
    })
}

exports.patchOrderAcceptd = (req,res,next)=>{
    const orderId = req.body.orderId;
    Order.findOne({_id:orderId}).then((order)=>{
        if(!order){
            const error = new Error('Order not Found');
            error.statusCode = 501;
            throw error;
        }
        order.status = 'Accepted will be deliverd in 50 minutes.';
        return order.save();
    }).then((order)=>{
        if(!order){
            const error = new Error('Order not updated. Kindly try again.');
            error.statusCode = 304;
            throw error;  
        }
        io.getIO().emit('products',{action:'userOrderAccepted',orderId:orderId});
        res.status(200).json({message:'Accepted Successfully.',orderId:orderId});
    }).catch((error)=>{
        console.log(error);
        next(error);
    })
}

exports.patchDeliveryStarted = (req,res,next)=>{
    const orderId = req.body.orderId;
    Order.findOne({_id:orderId}).then((order)=>{
        if(!order){
            const error = new Error('Order not Found');
            error.statusCode = 404;
            throw error;
        }
        order.delivery = 'Started.';
        return order.save();
    }).then((order)=>{
        if(!order){
            const error = new Error('Order not updated. Kindly try again.');
            error.statusCode = 304;
            throw error;  
        }
        io.getIO().emit('products',{action:'deliveryStarted',orderId:orderId});
        res.status(200).json({message:'Updated Successfully.',orderId:orderId});
    }).catch((error)=>{
        console.log(error);
        next(error);
    })
    
}

exports.patchOrderDelivered = (req,res,next)=>{
    const orderId = req.body.orderId;
    Order.findOne({_id:orderId}).then((order)=>{
        if(!order){
            const error = new Error('Order not Found');
            error.statusCode = 404;
            throw error;
        }
        order.delivery = 'Delivered.';
        return order.save();
    }).then((order)=>{
        if(!order){
            const error = new Error('Order not updated. Kindly try again.');
            error.statusCode = 304;
            throw error;  
        }
        io.getIO().emit('products',{action:'orderDelivered',orderId:orderId});
        res.status(200).json({message:'Updated Successfully.',orderId:orderId});
    }).catch((error)=>{
        console.log(error);
        next(error);
    })
    
}

