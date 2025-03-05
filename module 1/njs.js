const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv');

const routes = require('./routes');

dotenv.config();
// function rqListener(req,res){

// }

// http.createServer(rqListener);

const server = http.createServer(routes);



const PORT = process.env.PORT || 3000;



server.listen(PORT,()=>{
    console.log(`The server's running on ${PORT}`);
});