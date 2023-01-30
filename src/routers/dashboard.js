const express = require('express')
const router = new express.Router()
const Dashboard = require('../models/dashboard')

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

router.post('/dashboard',validateCookie, (req, res) => {
    console.log('store dash')
    const dash = new Dashboard(req.body)
    dash.save().then(() => {
        res.status(201).send(dash)
    }).catch((e) => {
        res.status(400).send(e)
    })
  })
  
  
  
  router.get('/dashboards/:attr',validateCookie, async (req, res) => {
    console.log('retrieve dash')
    const attr = req.params.attr
    Dashboard.findById(attr).then((dashboards) => {
        res.json(dashboards);
    }).catch((e) => {
        res.status(500).send()
    })
  })
  
  router.delete('/dashboards/:attr',validateCookie, async (req, res) => {
    console.log('delete dash')
    const attr = req.params.attr
    Dashboard.findByIdAndDelete(attr).then((dashboards) => {
        res.json(dashboards);
    }).catch((e) => {
        res.status(500).send()
    })
  })
  
  router.get('/dashboards',validateCookie, async (req, res) => {
    console.log('retrieve all dashs')
    const attr = req.params.attr
    Dashboard.find({}).select("dashName").then((dashboards) => {
        res.json(dashboards);
    }).catch((e) => {
        res.status(500).send()
    })
  })
  
  router.get('/dashboard/:attr',validateCookie, async (req, res) => {
    console.log('retrieve dash')
    const attr = req.params.attr
    Dashboard.findById({attr}).select().then((dashboards) => {
        res.json(dashboards);
    }).catch((e) => {
        res.status(500).send()
    })
  })
  
  router.put('/dashboards/:id',validateCookie, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['dashName','dash']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }
    //console.log(req.body)
    try {
        const inc = await Dashboard.findByIdAndUpdate(req.params.id, req.body , {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
  
        if (!inc) {
            return res.status(404).send()
        }
  
        res.send(inc)
    } catch (e) {
        res.status(400).send(e)
    }
  })

  module.exports = router