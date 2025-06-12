const fs = require("fs");

const deleteFile = (filePath) =>{
    fs.unlink(filePath, (err)=>{
        if(err){
            if(err && err.code !== 'ENOENT'){
                console.log("Failed to delete File",err);
            }
        }
    })
}

exports.deleteFile = deleteFile;