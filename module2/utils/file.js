const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) =>{
    fs.unlink(path.join(__dirname,"..", "public", filePath), (err) => {
        if(err && err.code !== 'ENOENT'){
            console.log("File deletion failed:", err);
        }
    })
}

exports.deleteFile = deleteFile;