const twilio = require('../twilio').twilio;
const User = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))
var contact;
exports.phoneVerificationPart1 = (req,res,next)=>{
    contact = req.body.contact;
    User.findOne({contact:req.body.contact.replace('+92','0')}).then((user)=>{
     
        if(user){
           return  res.status(406).json({message:'Kindly Try again or You are already a user.'});
        }
        twilio.verify.services('VA5920b5c021296677f11520ec2d7d8264')
             .verifications
             .create({to: contact, channel: 'sms'})
             .then((verification)=>{
                res.status(200).json({message:'Code has been sent.',contact:contact});
             }).catch((err)=>{
                console.log(err);
                res.status(406).json({message:'Kindly Try again.'});
             });
    })
    

    // messagebird.verify.create(contact,{
    //     template:'Your verification code is: %token'
    // },function(err,response){
    //     if(err){
    //         console.log(err);
    //         res.status(406).json({message:'Kindly Try again.'});
    //     }else{
    //         res.status(200).json({message:'Code has been sent.',id:response.id,contact:contact});
    //     }
    // });
};

exports.phoneVerificationPart2 = (req,res,next)=>{
    // const id = req.body.id;
    const token = req.body.code;

    twilio.verify.services('VA5920b5c021296677f11520ec2d7d8264')
    .verificationChecks
    .create({to: contact, code: token})
    .then((verification_check) =>{ res.status(200).json({message:'Your number has been verified.'});
    }).catch((err)=>{
    res.status(406).json({message:'Wrong Code or code has expired.'});
    })
    // messagebird.verify.verify(id,token,function(err,response){
    //     if(err){
    //        console.log(err)
    //         res.status(406).json({message:'Wrong Code or code has expired.'});
            
    //     }else{
    //         res.status(200).json({message:'Your number has been verified.'});
    //     }
    // })
}

exports.getContact = (req,res,next)=>{

    if(contact){
   
        res.status(200).json({contact:contact});
    }else{
    
        res.status(410).json({message:'Due to some issue your number is not found. Kindly verify again.'});
    }
}

exports.SignUp = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact.replace('+92','0');
    bcrypt.hash(password,12).then((hashed_password)=>{
       
            const user = new User({name:name,contact:contact,email:email,cart:{items:[],TotalPrice:0},password:hashed_password});
            return user.save();
        
        
    }).then((user)=>{
        if(user){
            return res.status(201).json({message:'SignUp Successfully.'})
        }
            
        throw new Error();
        
        
    }).catch((error)=>{
        console.log(error);
        res.status(500).json({message:'You are already a User.'});
    })
   
}

exports.SignIn = (req,res,next)=>{
    const contact = req.body.contact;
    const password = req.body.password;
    let fetchedUser;
    User.findOne({contact:contact}).then((user)=>{
        if(!user){
            const error = new Error();
            error.message = 'You need to SignUp First.';
            error.statusCode = 401;
            throw error;
        }
        fetchedUser = user;
        return bcrypt.compare(password,user.password);
    }).then((result)=>{
        if(!result){
           return res.status(401).json({message:'Password is Incorrect.',contact:contact});
        }

        const token = jwt.sign({userContact:fetchedUser.contact,userId:fetchedUser._id},process.env.JWT_KEY,{expiresIn:"1h"});
        res.status(200).json({message:'SignIn Successfully.',token:token,userContact:fetchedUser.contact,expiresIn:3600});
    }).catch((error)=>{
        next(error);
    })
   
}


exports.getUser = (req,res,next)=>{
    const userId = req.userId;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('User Not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({name:user.name,email:user.email});
    }).catch((error)=>{
        next(error);
    })

}

exports.updateUser  = (req,res,next)=>{
    const userId = req.userId;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({_id:userId}).then((user)=>{
        if(!user){
            const error = new Error('User Not found');
            error.statusCode = 404;
            throw error;
        }
        user.name = name;
        user.email = email;
        return bcrypt.hash(password,12).then((hashed_password)=>{
       
            user.password = hashed_password;
            return user.save();
        })
       
    }).then((user)=>{
        if(!user){
            const error = new Error('User Not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Updated Successfully'});

    }).catch((error)=>{
        next(error);
    })
}

exports.resetPasswordPt1 = (req,res,next)=>{
    const email = req.body.email;
   
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            res.status(501).json({message:'Internal error has occured. kindly try again.'})
        }

        const token = buffer.toString('hex');
        User.findOne({email:email}).then((user)=>{
        
            if(!user){
                const error =  new Error('You are not a user.');
                error.statusCode = 404;
                throw error;
            }
            user.resetToken = token;
        
            user.resetTokenExpiration = new Date().getTime() + 3600000;
            return user.save();
        }).then((user)=>{
            if(!user){
                const error =  new Error('You are not a user.');
                error.statusCode = 404;
                throw error;
            }
           return  transporter.sendMail({
                to:email,
                from:'foodway@way.com',
                subject:'Password Change Request',
                html:`
                    <p>Click the link to Reset Password </p>
                    <p>This link is valid for ONE HOUR.</p>
                    <a href="http://localhost:4200/reset_form_pt2/${token}">Link to Reset the Password.</a>
                `
            })
        }).then((result)=>{
            if(result.message!='success'){
                const error =  new Error('Internal error has occured.');
                error.statusCode = 501;
                throw error;
            }
            res.status(200).json({message:'Email has been sent.'});
        }).catch((error)=>{
            next(error);
        })
       
    })
   
}
  
exports.resetPasswordPt2 = (req,res,next)=>{
 
    const token = req.body.token;
    const password = req.body.password;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:new Date().getTime()}}).then((user)=>{
        if(!user){
            const error =  new Error('Your token has been expired.');
            error.statusCode = 408;
            throw error;
        }
        user.resetToken = undefined; 
        user.resetTokenExpiration = undefined;
        return bcrypt.hash(password,12).then((hashed_password)=>{
            user.password = hashed_password;
        
            return user.save();
        })
    }).then((user)=>{
        if(!user){
            const error =  new Error('Internal error has occured.');
                error.statusCode = 501;
                throw error;
        }
        res.status(200).json({message:'Your password has been updated.'});
    }).catch((error)=>{
        console.log(error);
        next(error);
    })
}