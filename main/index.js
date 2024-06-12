const express = require('express');
// import server from 'http'
const cors  = require("cors")
const axios = require("axios")
let bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
let nspell = require('nspell')
et nspell = require('nspell')
const { fetchDiv } = require('./bind.js')
const app = express(); //creates the express app
const router = express.Router()
app.use(cors({
    origin : ["https://collabowid2.web.app","https://collabowid2.firebaseapp.com","https://colllabowiduko.netlify.app"]
}));

app.use( bodyParser.json({ limit : '3000mb' }) );       // to support JSON-encoded bodies

app.use( bodyParser.urlencoded({
    limit : '50mb',// to support URL-encoded bodies
    extended : true
}));


router.post("/email", async(req,res) => {
    try{

        let transporter = nodemailer.createTransport({
            service : process.env.service,
            host: process.env.host,
            port: process.env.port,
            secure: true,
            auth : {
                user: process.env.email,
                pass: process.env.password
            }
        });
        const mailOptions = {
            from : 'late developers ' + process.env.email, // sender address
            to : req.body.email, // list of receivers
            subject : req.body.subject, // Subject line
            html : req.body.html // plain text body
        };
    
        const info = await transporter.sendMail(mailOptions);
        if(info)
            res.status(200).json({ 'status' : true, info });

    }catch(error){
        res.status(500).json({ error : error.message})
    }
})

router.post("/add", async (req, res) => {

    try{

        let {l_name, f_name, telephone, email} = req.body

        const bindFetch = await fetchDiv()

        const query = {}
        const { config, error } = await bindFetch.SELECT({ query, type : "one", db : process.env.DATABASE, collection : process.env.COLLECTION, options : {} })
        
        if(error){
            res.status(500).json({status:false,response:error.message})
        }
        if(config){

            const insert_rows = await bindFetch.INSERT({
          
                type : "one",
                db : process.env.DATABASE,
                collection : process.env.COLLECTION,
                data : {
                    l_name,
                    f_name,
                    telephone,
                    email
                },
                options : {}
              })

              if(insert_rows.hasOwnProperty("error") && insert_rows.error){
                res.status(500).json({status:false,response:insert_rows.error.message})
              }

              res.status(200).json({response:"success", status:true})

        }else{

            res.status(200).json({response:"already in our system", status:false})
        }

    }catch(error){

        res.status(500).json({status:false,response:error.message})
    }


})


app.use("/newsletter",router)

module.exports = { app }
