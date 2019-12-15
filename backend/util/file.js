const fs = require('fs');

exports.deleteFile = (filePath,res)=>{
     fs.unlink(filePath,(err)=>{
        if(err){
            console.log("File Deletion error")
            res.status(500).json({message:'Kindly Try again.'});
        
        }
       
    })
}
