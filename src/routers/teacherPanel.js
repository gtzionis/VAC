const express = require('express')
const bodyParser = require('body-parser');
const rdfParser = require("rdf-parse").default;
const router = new express.Router()
const TCN = require('../models/TCN')
const parserTP = require('../functions/parserOfGroups')
const mongoose = require('mongoose')
let ClassroomValue = ""

let validateCookie = (req,res,next) => {
    //console.log('Cookies: ', req.cookies)
    let cookies = 'auth='+req.cookies.auth+'; '+' refresh='+req.cookies.refresh
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

        async function activeAgents(classTCNData) {
            let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
            const resp  = await fetch(`${request}/kbs/api/services/WAR/wpm`)
            let agentData = await resp.json()
            //console.log(agentData.Agents)
            //console.log(agentData.Agents.filter(obj => obj.sτatus))
            let checkActive = true
            agentData.Agents.forEach(element => {
                //console.log(element.status)
                if(element.status=='inactive' && classTCNData.find(obj => 'agent-core-'+obj.UserId == element.agentName)){
                    checkActive = false
                }
            });
            return checkActive;
        }

//TP -> Agents
router.post('/assessment' ,validateCookie, async (req,res)=>{
    //let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh
    let auth = req.cookies.auth
    console.log('Send Assessment')
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    const resp  = await fetch(`${request}/kbs/api/info/local?attr=UserId&attr=Name&attr=FirstSurname&attr=Classroom`)
    let classTCNData = await resp.json()

    const respAgents = await fetch(`${request}/kbs/api/services/WAR/wpm`)
    let agentsStatus = await respAgents.json()

    let requestAgent = process.env.TEACHER_PANEL_TO_AGENT || 'http://localhost:2000'
    ClassroomValue = req.body.Classroom
    //console.log(classTCNData)
    let final = {UserId:classTCNData.filter(obj=> obj.Classroom == ClassroomValue).map(obj=> obj.UserId)}
    //console.log(classTCNData.filter(obj=> obj.Classroom == ClassroomValue).map(obj=> obj.UserId))
    let inactiveAgents = agentsStatus.Agents.filter(obj => obj.status == 'inactive')
    //console.log(inactiveAgents)
    let finalUserId = {agents:[]}
    final.UserId.forEach(element => {
        if(inactiveAgents.find(obj => obj.agentName == 'agent-core-'+element)){
            finalUserId.agents.push(element)
        } 
    });
    fetch( `${process.env.WPM_IP}/welcome/integration/platform/agent/wakeUpAgents` || 'http://localhost:2000/SendRestoOtherEndpoint', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : req.cookies.auth
                //'Cookie':cookies
            },
            body: JSON.stringify(finalUserId) ,
            redirect: 'follow'
            })
            .then(response => { return response.json()})
            .then(data => {
                //console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            let result = null
            let display = setInterval( async () =>{  
                result = await activeAgents(classTCNData.filter(obj=> obj.Classroom == ClassroomValue))
                if(result==true){
                    console.log('All Agents active')
                    clearInterval(display)
                    classTCNData.filter(obj=> obj.Classroom == ClassroomValue).map(obj=> obj.UserId).forEach(element => {
 
                            fetch( `${requestAgent}/welcome/integration/workflow/dispatcher/teacherToAgent` || 'http://localhost:2000/SendRestoOtherEndpoint', {
                            method: 'POST', // or 'PUT'
                            headers: {
                                'Content-Type': 'text/plain',
                                'X-Agent-Capability' : 'Assessment',
                                'X-User-ID':element,
                                'Authorization' : "Bearer "+req.cookies.auth
                                //'Cookie':cookies
                            },
                            body: req.body.Assessment ,
                            redirect: 'follow'
                            })
                            .then(response => { return response.text()})
                            .then(data => {
                                //console.log(data);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    }); 
                }else{
                    console.log('Not all Agents are active')
                }
            }, 10000)

            
    
    res.send(req.body)
})



//Agents -> TP (VACDB)
router.post('/AgentToTeacherPanel' ,(req,res)=>{
    
    if(req.headers['x-msg-type'] == 'Assessment-Scores'){
        console.log('Receive scores')
        const textStream = require('streamify-string')(req.body);
    let finalTCNObject = {
        agentUri:"",
        agentId:"",
        Name:"",
        Gender:"",
        Nationality:"",
        LccGenderPreference:"",
        LccNationPreference:"",
        LessonId:0,
        AssessmentScore:0,
        ReadingScore:0,
        WritingScore:0,
        ListeningScore:0,
        VocabularyScore:0
    }

    rdfParser.parse(textStream, { contentType: 'text/turtle', baseIRI: 'https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#' })
    .on('data', (quad) => { 
        if(quad._subject.id.includes('agents')){
            finalTCNObject.agentUri=quad._subject.id.substring(quad._subject.id.lastIndexOf('/')+1)
        }
        else{
            finalTCNObject.subjectUri=quad._subject.id.substring(quad._subject.id.lastIndexOf('#')+1)
        }
        if(quad._predicate.id.includes('agentId')){ 
            finalTCNObject.agentId=parserTP.cleanTheString(quad._object.id)
        }
        if(quad._predicate.id.includes('hasName')){ //hasName
            finalTCNObject.Name=parserTP.cleanTheString(quad._object.id)
        }
        if(quad._predicate.id.includes('hasGender')){ 
            finalTCNObject.Gender=parserTP.cleanTheString(quad._object.id)
        }
        if(quad._predicate.id.includes('hasLccGenderPreference')){ 
            finalTCNObject.LccGenderPreference=parserTP.cleanTheString(quad._object.id)
        }
        if(quad._predicate.id.includes('hasLccNationPreference')){ 
            finalTCNObject.LccNationPreference=parserTP.cleanTheString(quad._object.id) 
        }
        if(quad._predicate.id.includes('hasNationality')){ 
            finalTCNObject.Nationality=parserTP.cleanTheString(quad._object.id)  
        }
        if(quad._predicate.id.includes('hasAssessmentScore')){ 
            finalTCNObject.AssessmentScore=parseFloat(parserTP.cleanTheString(quad._object.id))
        }
        if(quad._predicate.id.includes('hasLessonId')){ 
            finalTCNObject.LessonId=parseFloat(parserTP.cleanTheString(quad._object.id))
        }
        if(quad._predicate.id.includes('hasListeningScore')){ 
            finalTCNObject.ListeningScore=parseFloat(parserTP.cleanTheString(quad._object.id))
        }
        if(quad._predicate.id.includes('hasReadingScore')){ 
            finalTCNObject.ReadingScore=parseFloat(parserTP.cleanTheString(quad._object.id))
        }
        if(quad._predicate.id.includes('hasVocabularyScore')){ 
            finalTCNObject.VocabularyScore=parseFloat(parserTP.cleanTheString(quad._object.id.replace(/["]+/g, '')))
        }
        if(quad._predicate.id.includes('hasWritingScore')){ 
            finalTCNObject.WritingScore=parseFloat(parserTP.cleanTheString(quad._object.id))
        }
    })
    .on('error', (error) => console.error(error))
    .on('end', () => {
        console.log('Success to save the scores')
        //console.log(finalTCNObject)
        let TCNAssessment = new TCN(finalTCNObject)
        TCNAssessment.save()
    });
    res.status(201).send('TCNs Assement scores saved')
    }else{
        console.log('Receive groups')
        const textStream = require('streamify-string')(req.body);
        let allTriples = []
        rdfParser.parse(textStream, { contentType: 'text/turtle', baseIRI: 'https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#' })
        .on('data', (quad) => {
            let objTriple = {
                subject:"",
                predicate:"",
                object:""
            }
            objTriple.subject = quad._subject.id
            objTriple.predicate = quad._predicate.id
            objTriple.object = quad._object.id
            allTriples.push(objTriple)
        })
        .on('error', (error) => console.error(error))
        .on('end', () => {
            console.log('Success to save the groups')
            parserTP.parserOfGroups(allTriples)
        });
        res.send('Groups Stored')
    }

})

//TP -> VACDB
router.get('/resultOfAssesesments',validateCookie,(req,res)=>{
    TCN.find({}).then((tcns) => {
        res.json(tcns);
    }).catch((e) => {
        res.status(500).send()
    })
})

//TP -> Agents
router.post('/groupOfTCNs',validateCookie ,(req,res)=>{
    //let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh
    let auth = req.cookies.auth
    console.log('Send group')
    
    //console.log(req.body.dedicatedAgent)
    

    let requestAgent = process.env.TEACHER_PANEL_TO_AGENT || 'http://localhost:2000'
    req.body.dedicatedAgent.forEach(element => {

        let dedicatedAgent = ""

        if(element.includes('agent-core-')){
            dedicatedAgent = element.replace('agent-core-','')
        }else{
            dedicatedAgent = element.replace('agent','')
        }
        console.log(dedicatedAgent)
            fetch( `${requestAgent}/welcome/integration/workflow/dispatcher/teacherToAgent` || 'http://localhost:2000/SendRestoOtherEndpoint', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'text/plain',
                'X-Agent-Capability' : 'TCN-Group',
                'X-User-ID' : dedicatedAgent,
                'Authorization' :  "Bearer "+req.cookies.auth
                //'Cookie':cookies
            },
            body: req.body.Group ,
            redirect: 'follow'
            })
            .then(response => { return response.text()})
            .then(data => {
                //console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
    res.send(req.body)
})

//Agent -> TP (VACDB)
router.post('/resultsOfGroups', validateCookie ,(req,res)=>{
    
})

//TP -> VACDB
router.get('/resultsOfGroups' , validateCookie,(req,res)=>{
    parserTP.groupsTCN.find({}).then((groupa) => {
        let objg = JSON.stringify(groupa[0])
        res.json(groupa);
    }).catch((e) => {
        res.status(500).send()
    })
})

//TP -> Agents
router.post('/finalGroup',validateCookie, async (req,res)=>{
    //here to delete assessemnsts and the groups
    parserTP.groupsTCN.deleteMany({}).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    TCN.deleteMany({}).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    
    //let cookies = 'auth='+req.cookies.auth+';'+' refresh='+req.cookies.refresh
    let auth = req.cookies.auth
    console.log('Send final Group')
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    const resp  = await fetch(`${request}/kbs/api/info/local?attr=UserId&attr=Name&attr=FirstSurname&attr=Classroom`)
    let classTCNData = await resp.json()
    let requestAgent = process.env.TEACHER_PANEL_TO_AGENT || 'http://localhost:2000'
    classTCNData.filter(obj=> obj.Classroom == ClassroomValue).map(obj=> obj.UserId).forEach(element => {
        fetch( `${requestAgent}/welcome/integration/workflow/dispatcher/teacherToAgent` || 'http://localhost:2000/SendRestoOtherEndpoint', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'text/plain',
            'X-Agent-Capability' : 'Final-Group',
            'X-User-ID' : element,
            'Authorization' : "Bearer "+req.cookies.auth
            //'Cookie':cookies
        },
        body: req.body ,
        redirect: 'follow'
        })
        .then(response => { return response.text()})
        .then(data => {
            //console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    })
    
    res.send(req.body)
})

//TP -> ?
router.get('/lessons',(req,res)=>{
    res.send(req.body)
})

//TP
router.post('/SendRestoOtherEndpoint',(req,res)=>{
    console.log("Response was sent")
    console.log(req.body)
    res.send(req.body)
})

router.get('/tcnClass',validateCookie,(req,res)=>{
    console.log('retrieve data for the classrooms')
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    fetch(`${request}/kbs/api/info/local?attr=UserId&attr=Name&attr=FirstSurname&attr=Classroom`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              //'Authorization':req.cookies.auth,
              //'Refresh':req.cookies.refresh
          },
          credentials: "include"
          })
          .then(response => response.json())
          .then(data => { 
            res.json(data)
          })
          .catch((error) => {
              console.error('Error:', error);
          });
})

router.post('/tcnClass',validateCookie,(req,res)=>{
    console.log('create classrooms')
    let request = process.env.KBS_ENDPOINT || 'http://localhost:8080'
    let final = {Classroom:req.body.Classroom}
    req.body.classTCN.forEach(element => {
        fetch(`${request}/kbs/api/info/local?label=agent-core-${element}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                //'Authorization':req.cookies.auth,
                //'Refresh':req.cookies.refresh
            },
            body: JSON.stringify(final)
            })
            .then(data => { 
              res.status(200)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
})


router.get('/agentClass', (req,res) =>{s
    let out =[{
        "user_id": "12",
        "first_name": "John",
        "last_name": "Doe",
        "preferred_language": "en",
        "registration_date": "2021-01-01T12:12:12.111",
        "account_status": "active"
        },{
        "user_id": "123",
        "first_name": "Greg",
        "last_name": "Doe",
        "preferred_language": "en",
        "registration_date": "2021-01-01T12:12:12.111",
        "account_status": "active"
        },{
        "user_id": "1234",
        "first_name": "George",
        "last_name": "Doe",
        "preferred_language": "en",
        "registration_date": "2021-01-01T12:12:12.111",
        "account_status": "active"
        }

    ]
  
    res.json(out)
  })

module.exports = router
