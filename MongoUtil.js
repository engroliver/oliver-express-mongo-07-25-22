const MongoClient = require('mongodb').MongoClient;
async function connect(mongoUri,databaseName){
    const client = await MongoClient.connect(mongoUri,{useUnifiedTopology:true
    })
    // client.db
    const db = client.db(databaseName);
    return db;
}


// export function
module.exports = {connect};