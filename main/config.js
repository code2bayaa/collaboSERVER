const { MongoClient } = require('mongodb');
const data = require('dotenv')


data.config()

const runDB = async() => {
    
    try{
        
        const client = new MongoClient(process.env.MONGODB);
        await client.connect();

        return client

    }catch(error){
        //console.log(error)
    }
}

module.exports = {
    runDB,
}