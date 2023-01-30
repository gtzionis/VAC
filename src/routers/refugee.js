const express = require('express')
const router = new express.Router()
const Refugee = require('../models/refugee')


  
  router.get('/ref/test/'+process.env.BASE_HREF, (req,res) => {
    res.send("VAC path is Running")
  })

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
          credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            if(data.isActive){
              console.log('Validation completed')
              req.roles = data.roles;
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
  
  router.get('/refugees/:attr', validateCookie ,async (req, res) => {
    let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh  
    console.log('Request data from KBS: '+req.params.attr)
    //console.log(req.roles)
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    fetch(`${request}/kbs/api/info/local?attr=${req.params.attr}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              "Authorization": req.cookies.auth,
              //'Cookie':cookies
          },
          credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            res.json(data)
          })
          .catch((error) => {
              console.error('Error:', error);
              res.status(500).send()
          });  
  })

  router.get('/refugeesSelClass/:attr', async (req, res) => {
    const attr = req.params.attr
    Refugee.find({"Class":attr},{'_id': true}).select('Activities').then((refugees) => {
        res.json(refugees);
    }).catch((e) => {
        res.status(500).send()
    })
  })

  router.get('/SelectAttr/:clas?', validateCookie ,async (req, res) => {
    const clas = req.params.clas
    let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh 
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    let queryAttr = ""
    if(typeof(req.query.attr)=='object'){
      req.query.attr.forEach(element => {
        queryAttr=`attr=${element}&${queryAttr}`
      });
      request = `${request}/kbs/api/info/local?${queryAttr.slice(0, -1)}` 
    }else{
      request = `${request}/kbs/api/info/local?attr=${req.query.attr}`
    }
    console.log('Request data from KBS2: '+queryAttr)
    fetch(request, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              "Authorization": req.cookies.auth,
              //'Cookie':cookies
          },
          credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            //console.log(data[0])
            res.json(data)
          })
          .catch((error) => {
              console.error('Error:', error);
              res.status(500).send()
          }); 
    
  })

  router.get('/refugee/one', validateCookie ,async (req, res) => {
    let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh
    console.log('here')  
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    console.log('Request data for a TCN from KBSs')
    fetch(`${request}/kbs/api/info/local?label=agent-core-${req.query.label}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              "Authorization": req.cookies.auth,
              //'Cookie':cookies
          },
          credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            res.json(data)
            console.log(data)
          })
          .catch((error) => {
              console.error('Error:', error);
              res.status(500).send()
          });  
  })

  

  module.exports = router