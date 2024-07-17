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

        // let { label, textBox } = req.body
        // const bindFetch = await fetchDiv()

        // const insert_rows = await bindFetch.INSERT({
        
        //     type : "one",
        //     db : process.env.DATABASE,
        //     collection : process.env.REPORT,
        //     data : {
        //         ...req.body
        //     },
        //     options : {}
        // })

        // console.log(insert_rows)
        // if(insert_rows.hasOwnProperty("error") && insert_rows.error){
        //     res.status(500).json({status:false,response:insert_rows.error.message})
        // }

        const { degrees, PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

        // const pdfDoc = await PDFDocument.create()

        // const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
        // const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
      
        // const pdfDoc = await PDFDocument.load(existingPdfBytes)
        // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
        // const pages = pdfDoc.getPages()
        // const firstPage = pages[0]
        // const { width, height } = firstPage.getSize()
        // firstPage.drawText('FRAUD REPORT', {
        //   x: 5,
        //   y: height / 2 + 300,
        //   size: 50,
        //   font: helveticaFont,
        //   color: rgb(0.95, 0.1, 0.1),
        //   rotate: degrees(-45),
        // })

        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const fontSize = 30
        page.drawText('FRAUD REPORT', {
          x: width/2 - 10,
          y: height - 4 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0.53, 0.71),
        })

        const form = pdfDoc.getForm()

        const top = height - 6 * fontSize
        page.drawText('personal email:', { x: 50, y: top, height:30, size: 20 })

        const emailField = form.createTextField("email")
        emailField.setText(`${req.body.email}`)

        emailField.addToPage(page, {
            x: 100,
            y: top - 30,
            width: 450,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('type of concern:', { x: 50, y: top - 60, height:30, size: 20 })

        const concernField = form.createTextField("concern")
        concernField.setText(`${req.body.concern}`)
        concernField.addToPage(page, {
            x: 100,
            y: top - 90,
            // width: 150,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('has it stopped? ', { x: 50, y: top - 120, height:30, size: 20 })

        const stoppedField = form.createTextField("stopped")
        stoppedField.setText(`${req.body.stopped}`)
        stoppedField.addToPage(page, {
            x: 100,
            y: top - 150,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('Your full names? ', { x: 50, y: top - 180, height:30, size: 20 })

        const namesField = form.createTextField("names")
        namesField.setText(`${req.body.names}`)
        namesField.addToPage(page, {
            x: 100,
            y: top - 210,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('Why do you think it should be investigated? ', { x: 50, y: top - 240, height:30, size: 20 })

        const investigatedField = form.createTextField("investigated")
        investigatedField.setText(`${req.body.investigated}`)
        investigatedField.addToPage(page, {
            x: 100,
            y: top - 270,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('Please describe the concern you are reporting. What took place?', { x: 50, y: top - 300, height:30, size: 20 })
        
        const describeField = form.createTextField("describe")
        describeField.setText(`${req.body.describe}`)
        describeField.addToPage(page, {
            x: 100,
            y: top - 330,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });


          page.drawText('Where did it take place?', { x: 50, y: top - 360, height:30, size: 20 })

        const placeField = form.createTextField("place")
        placeField.setText(`${req.body.place}`)
        placeField.addToPage(page, {
            x: 100,
            y: top - 390,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });


          page.drawText('People involved in the incident?', { x: 50, y: top - 420, height:30, size: 20 })

        const involvedField = form.createTextField("involved")
        involvedField.setText(`${req.body.involved}`)
        involvedField.addToPage(page, {
            x: 100,
            y: top - 450,
            // width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });


          page.drawText('What is the name of the organisation you work for?', { x: 50, y: top - 480, height:30, size: 20 })

        const organisationField = form.createTextField("organisation")
        organisationField.setText(`${req.body.organisation}`)
        organisationField.addToPage(page, {
            x: 100,
            y: top - 510,
            width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

          page.drawText('What is your job title?', { x: 50, y: top - 540, height:30, size: 20 })

        const jobsField = form.createTextField("jobs")
        jobsField.setText(`${req.body.jobs}`)
        jobsField.addToPage(page, {
            x: 100,
            y: top - 570,
            width: 200,
            height: 25,
            color:rgb(0, 0.53, 0.71),
            borderColor: rgb(0, 0.53, 0.71),
            borderWidth: 1,
          });

        // const agreeField = form.createTextField("agree")
        // agreeField.setText(`${req.body.agree}`)
        // agreeField.addToPage(page, {
        //     x: 100,
        //     y: 150,
        //     width: 200,
        //     height: 25,
        //     color:rgb(0, 0.53, 0.71),
        //     borderColor: rgb(0, 0.53, 0.71),
        //     borderWidth: 1,
        //   });

        const pdfBuffer = await pdfDoc.save()

        let transporter = nodemailer.createTransport({
            service : process.env.service,
            host: process.env.host,
            auth : {
                user: process.env.email,
                pass: process.env.password
            }
        });
        const mailOptions = {
            from : 'late developers ' + process.env.email, // sender address
            to : "info@collabowid.org", // list of receivers
            subject : "REPORT FRAUD PDF", // Subject line
            html : "Find the attached report below;", // plain text body
            attachments: [
                {
                  filename: 'report.pdf',
                  content: pdfBuffer,
                  contentType: 'application/pdf',
                },
              ],
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({response:"success", status:true})

    }catch(error){

        console.log(error)
        res.status(500).json({status:false,error:error.message})
    }

})


app.use("/newsletter",router)

module.exports = { app }
