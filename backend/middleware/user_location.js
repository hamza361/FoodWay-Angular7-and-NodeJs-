const NodeGeocoder = require('node-geocoder');

module.exports = (req,res,next)=>{
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const options = {
        provider: 'google',
        httpAdapter: 'https', // Default
        apiKey:'AIzaSyADRXYcpnA6NQ8EKtXWGRSkJdY-1sza9II', // for Mapquest, OpenCage, Google Premier
        formatter: 'json' // 'gpx', 'string', ...
      };
    try{
        const  geocoder = NodeGeocoder(options);
        geocoder.reverse({lat:latitude, lon:longitude}, function(err, res) {
            if(err){
                throw new Error();
            }
            req.address = res[0].formattedAddress;
            next();
           
         });

    }catch(error){
        res.status(412).json({message:'Something went wrong. kindly try again.'});
    }
  
 
    
}