const Snack_Products = require('../models/snacks');
const fileHelper = require('../util/file');
const io = require('../socket');
exports.getProducts = (req,res,next)=>{
    Snack_Products.find().then((products)=>{
        if(!products){
            const error = new Error();
            throw error;
        }else{
            res.status(200).json({products:products});
        }
    }).catch((error)=>{
        error.message = "Fail to fetch Products. Check your Internet Connection.";
        error.statusCode = 500;
        next(error);
    })
}

exports.addProduct = (req,res,next)=>{
    const url = req.protocol + '://' + req.get("host");
    const name = req.body.name;
    const price = +req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    if(!req.file){
        const error  = new Error("Select an PNG, JPEG or JPG file.");
        error.statusCode = 422;
        error.product_data = {name:name,price:price,description:description,category:category};
        throw error;
    }
    const imagePath = url +"/images/"+req.file.filename;

    const product = new Snack_Products({name:name,imagePath:imagePath,price:price,description:description,category:category});
    product.save().then((product)=>{
        if(!product){
            const error = new Error();
            throw error;
        }
        io.getIO().emit('products',{action:'create',product:product});
        res.status(201).json({message:'Successfully Added.',product:product});
    }).catch((error)=>{
        error.message = "Something went wrong. Kindly try again.";
        error.statusCode = 501;
        next(error);
    })

}

exports.deleteProduct = (req,res,next)=>{
    const _id = req.body._id;
    Snack_Products.findOne({_id:_id}).then((product)=>{
        if(!product){
            const error = new Error('Fail to find the product.');
            throw error;
        }
        product.imagePath = product.imagePath.replace('http://localhost:3000/','backend/')
        fileHelper.deleteFile(product.imagePath,res);
        return Snack_Products.deleteOne({_id:_id});
   }).then((result)=>{
        if(result.n!=1){
            throw new Error("Something went wrong. Kindly try again.");
        }

        io.getIO().emit('products',{action:'delete',_id:_id});
        res.status(200).json({message:'Product Successfuly deleted.',_id:_id});

    }).catch((error)=>{
        error.message = "Something went wrong. Kindly try again.";
        error.statusCode = 501;
        throw error;
    })


}

exports.getProduct = (req,res,next)=>{
    const _id = req.params._id;
    Snack_Products.findById({_id:_id}).then((product)=>{

        if(!product){
        
            const error = new Error();
            throw error;
        }
        res.status(200).json({product:product});
    }).catch((error)=>{
        error.statusCode = 501;
        error.message = "Fail to Find Product.";
        next(error);
    })
}

exports.editProduct = (req,res,next)=>{
   
    const _id = req.body._id;
    const name = req.body.name;
    const price = +req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    let imagePath;
    let product;
    let old_image_path;
    if(!req.file){
        imagePath = req.body.imagePath;
        if(imagePath){
            product = {name:name,imagePath:imagePath,price:price,description:description,category:category};
        }else{
            const error  = new Error("Select an PNG, JPEG or JPG file.");
            error.statusCode = 422;
            error.product_data = {name:name,price:price,description:description,category:category};
            throw error;
        }
      
 
    }else{
        
        old_image_path = req.body.OldImagePath;
        old_image_path= old_image_path.replace('http://localhost:3000/','backend/')
        fileHelper.deleteFile(old_image_path,res);
        const url = req.protocol + '://' + req.get("host");
        imagePath = url +"/images/"+req.file.filename;
        product = {name:name,imagePath:imagePath,price:price,description:description,category:category};
      

    }
    Snack_Products.updateOne({_id:_id},product).then((result)=>{
        if(!result){
            const error = new Error("Fail to modify");
            error.statusCode = 304;
            throw error;
        }
        res.status(200).json({message:'Modified Successfully.'})
    }).catch((error)=>{
        next(error);
    })

}