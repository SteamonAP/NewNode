const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(process.env.database,process.env.user, process.env.password,
    {dialect: 'mysql',
    host : process.env.host
});

// sequelize.getConnection((err,connection) =>{
//     if(err) {
//         console.log("unable to connect to MySQL",err);
//     } else{
//         console.log("Connected to MySQL");
//         connection.release();
//     }
// });

sequelize.authenticate()
    .then(() =>{
        console.log("Connected to MySQL db");
    })
    .catch(err =>{
        console.log("unable to connect to MySQL",err);
    })

module.exports = sequelize;