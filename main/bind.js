const axios = require('axios')
const fs = require("fs")
const path = require("path")
const ServerData = require('./server');


async function fetchDiv(){

  const INDEX = async({db, collection, query}) => {
    try{

      const client = await ServerData.client()

      const config = await client.db(`${db}`).collection(collection).createIndex(query)
      return { config }

    }catch(error){

      console.log("index error : " +error)
      return {error}
    }
  }
  const SELECT = async({ type, db, collection, query, options }) => {

    try{

      const client = await ServerData.client()

      if(type === "one"){

        const config = await client.db(`${db}`).collection(collection).findOne(query, options)
        // //console.log(config)
        return { config }
      }else if(type === "many")
        return { config : await client.db(db).collection(collection).find(query, options) }
    
    }catch(error){
      //console.log(error)
      return { error }
    }

  } 
  const INSERT = async({ type, db, collection, data, options }) => {

    try{
    
      const client = await ServerData.client()
      // await ServerData.openClient()

      if(type === "one")
        return { config : await client.db(db).collection(collection).insertOne(data, options) }
      else if(type === "many")
        return { config : await client.db(db).collection(collection).insertMany(data, options) }
    
    }catch(error){
      return { error }
    }

  }

  const UPDATE = async({ type, db, collection, query, data, options }) => {
    
    try{

      const client = await ServerData.client()
      // await ServerData.openClient()

      if(type === "one")
        return { config : await client.db(db).collection(collection).updateOne(query, data, options) }
      else if(type === "many")
        return { config : await client.db(db).collection(collection).updateMany(query, data, options) }
      else if(type === "replace")
        return { config : await client.db(db).collection(collection).replaceOne(query, data, options) }

    }catch(error){
      return { error }
    }
    
  }

  const DELETE = async({ type, db, collection, query}) => {

    try{
      const client = await ServerData.client()

      if(type === "one")
        return { config : await client.db(db).collection(collection).deleteOne(query) }
      else if(type === "many")
        return { config : await client.db(db).collection(collection).deleteMany(query) }
    }catch(error){
      return { error }
    }

  }

  const countAll = async({ db, collection }) => {

    try{
      const client = await ServerData.client()
      // await ServerData.openClient()

      return { config : await client.db(db).collection(collection).estimatedDocumentCount() }
    }catch(error){
      return { error }
    }

  }

  const COUNT = async({ db, collection, query }) => {

    try{
      const client = await ServerData.client()
      // await ServerData.openClient()

      return { config : await client.db(db).collection(collection).countDocuments(query) }
    }catch(error){
      return { error }
    }

  }
    return {
      INDEX,
      SELECT,
      UPDATE,
      INSERT,
      DELETE,
      countAll,
      COUNT
    }
  }

   module.exports = {fetchDiv, ServerData}