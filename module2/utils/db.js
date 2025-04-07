const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const dotenv = require('dotenv');

dotenv.config();

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGODB_URI)
        .then(client => {
            console.log('Connected to MongoDB');
            _db = client.db()
            callback();
        })
        .catch(err =>{
            console.log(err);
            throw err;
        });
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw new Error('No database found');
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

