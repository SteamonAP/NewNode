const fs = require('fs');


const requestHandler = (req,res) =>{
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter a message</title><head>');
        res.write('<body><h1>HHello,greetings, enter details</h1></body>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
        res.write('</html>');
        return res.end();
        
    }
    if(url === '/users'){
    res.setHeader('Content-Type','text/html');
    res.write('</html>');
    res.write('<head><title>NJS INfo Page</title><head>');
    res.write('<body><ul><li>User 1</li><li>User 2</li></ul><body>');
    res.write('<html>');
    res.end();
    }
    if(url === '/create-user' && method === "POST"){

        const body = []

        req.on('data',(chunk)=>{
            body.push(chunk);
            console.log(chunk);
        });
        return req.on('end',()=>{
            const parsedData = Buffer.concat(body).toString();
            const message = parsedData.split("=")[0];
            fs.writeFile('form.txt',message,(err)=>{

                res.statusCode = 302;
                res.setHeader('Location','/');
                return res.end();

            });
        });
    };
    res.setHeader('Content-Type','text/html');
    res.write('</html>');
    res.write('<head><title>NJS INfo Page</title><head>');
    res.write('<body><h1>Hello...,Amogh</h1><body>');
    res.write('<html>');
    res.end();

};

module.exports = requestHandler;
    