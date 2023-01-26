const mongoClient = require('mongodb').MongoClient;
let db = null

module.exports = {
    connect:  (done) => {
        mongoClient.connect(process.env.DATABASE_URL, {useUnifiedTopology: true},(err,database) => {
            if(err) done(err);
            db = database.db(process.env.DATABASE);
        })
        done();
    },
    getDB: ()=>{ return db }
}