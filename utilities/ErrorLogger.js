const fs=require('fs');

exports.errorLoger=(err,req,res,next) => {
        fs.appendFile('./errorLogger.txt',`${new Date().toLocaleTimeString()}-${err.message} - ${err.stack}\n`, (error)=> {if(error){console.log("error in error logger")}});
        if(!err.status)
        {
            res.status(500).json({message : "Some internal error occured"});
        }
        else
        res.status(err.status).json({message : err.message});

};