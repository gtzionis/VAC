const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
let excelSchema = new mongoose.Schema({}, { strict: false });
let Excel = mongoose.model('Excel', excelSchema);

let validateCookie = (req,res,next) => {
    //console.log('Cookies: ', req.cookies)
    let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh
    fetch(process.env.VALIDATION_ENDPOINT || 'http://localhost:2000/validation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": req.cookies.auth, 
            "Refresh": req.cookies.refresh
          },
          //credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            if(data.isActive){  
              console.log("Validation completed")  
              next()
            }else{
              console.log('invalid token')
              res.redirect( process.env.WPM_ENDPOINT ||'https://www.google.com/');
            }
          })
          .catch((error) => {
              console.error('Error:', error);
          });
        }

router.post('/excel',validateCookie, (req, res) => {
    let excel = new Excel(req.body);
    excel.save().then(() => {
        res.status(201).send(excel)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get('/excelNames',validateCookie, (req, res) => {
        Excel.find({}).select("excelName").then((excel) => {
            res.json(excel);
        }).catch((e) => {
            res.status(500).send()
        })
  })

  router.get('/excelFields/:id',validateCookie, (req, res) => {
    const id = req.params.id
    Excel.findById(id,{'_id': false}).select().then((excel) => {
        res.json(excel);
    }).catch((e) => {
        res.status(500).send()
    })
  })

  router.get('/excel/:id/:attr',validateCookie, (req,res) => {
    const id = req.params.id
    const attr = req.params.attr  
    Excel.findById(id,{'_id': false}).select('data.'+attr).then((excel) => {
        res.json(excel);
    }).catch((e) => {
        res.status(500).send()
    })
  })

  router.get('/excel/:id/:attr',validateCookie, (req,res) => {
    const id = req.params.id
    const attr = req.params.attr  
    Excel.findById(id,{'_id': false}).select('data.'+attr).then((excel) => {
        res.json(excel);
    }).catch((e) => {
        res.status(500).send()
    })
  })

  router.get('/excelAttr/:id',validateCookie, (req,res) => {
    const id = req.params.id
    console.log(typeof req.query.attr)
    let queryRes = []
    if(typeof req.query.attr === 'object'){
        queryRes = req.query.attr.map(obj => 'data.'+obj)
    }else{
        queryRes.push('data.'+req.query.attr)
    }
    Excel.findById(id,{'_id': false}).select(queryRes).then((excel) => {
        res.json(excel);
    }).catch((e) => {
        res.status(500).send()
    })
  })

  router.delete('/excelDelete/:attr',validateCookie, async (req, res) => {
    console.log('delete excel')
    const attr = req.params.attr
    Excel.findByIdAndDelete(attr).then((excels) => {
        res.send('Excel deleted');
    }).catch((e) => {
        res.status(500).send()
    })
  })

module.exports = router