const express = require('express');
// import server from 'http'
const cors  = require("cors")
const axios = require("axios")
let bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
// let nspell = require('nspell')
const { fetchDiv } = require('./bind.js')
const app = express(); //creates the express app
const router = express.Router()

const cors__ = ["http://localhost:5173","https://collabowid.org","https://colllabowiduko.netlify.app"]
// if(window.location.origin.match("localhost"))
//     cors__ = ["https://collabowid.org","https://colllabowiduko.netlify.app","http://localhost"]

app.use(cors({
    origin : cors__
}));

app.use(bodyParser.json({ limit : '3000mb' }));       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({
    limit : '50mb',// to support URL-encoded bodies
    extended : true
}));


router.post("/email", async(req,res) => {
    try{

        const bindFetch = await fetchDiv()

        let transporter = nodemailer.createTransport({
            service : process.env.service,
            host: process.env.host,
            // port: process.env.port,
            // secure: true,
            auth : {
                user: process.env.email,
                pass: process.env.password
            }
        });
        const mailOptions = {
            from : 'late developers ' + process.env.email, // sender address
            to : "info@collabowid.org", // list of receivers
            subject : req.body.subject, // Subject line
            html : req.body.html // plain text body
        };
    
        const insert_rows = await bindFetch.INSERT({          
            type : "one",
            db : process.env.DATABASE,
            collection : process.env.COLLECTION,
            data : {
                email : req.body.email
            },
            options : {}
        })

        const info = await transporter.sendMail(mailOptions);
        if(info)
            res.status(200).json({ 'status' : true, info });

    }catch(error){
        console.log({error:error.message})
        res.status(500).json({ status : false, error : error.message})
    }
})

router.post("/add", async (req, res) => {

    try{

        let { email } = req.body

        const bindFetch = await fetchDiv()

        const query = { email }
        const { config, error } = await bindFetch.SELECT({ query, type : "one", db : process.env.DATABASE, collection : process.env.COLLECTION, options : {} })
        // console.log("db:" + process.env.DATABASE)
        console.log(config)
        // if(error){
        //     res.status(500).json({status:false,error:error.message})
        // }
        if(config){

            res.status(200).json({response:"already in our system", status:false})

        }else{
            const insert_rows = await bindFetch.INSERT({
          
                type : "one",
                db : process.env.DATABASE,
                collection : process.env.COLLECTION,
                data : {
                    // name,
                    email
                },
                options : {}
            })

            if(insert_rows.hasOwnProperty("error") && insert_rows.error){
                res.status(500).json({status:false,response:insert_rows.error.message})
            }

            res.status(200).json({response:"success", status:true})

            
        }

    }catch(error){

        res.status(500).json({status:false,error:error.message})
    }


})


router.post("/report", async (req, res) => {

    try{

        const bindFetch = await fetchDiv()

        const insert_rows = await bindFetch.INSERT({
        
            type : "one",
            db : process.env.DATABASE,
            collection : process.env.REPORT,
            data : {
                ...req.body
            },
            options : {}
        })

        console.log(insert_rows)
        // if(insert_rows.hasOwnProperty("error") && insert_rows.error){
        //     res.status(500).json({status:false,response:insert_rows.error.message})
        // }

        res.status(200).json({response:"success", status:true})

    }catch(error){

        res.status(500).json({status:false,error:error.message})
    }

})


app.use("/newsletter",router)

module.exports = { app }
