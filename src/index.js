const express = require('express')
const fs = require('fs')
const path = require('path')
const hbs = require('hbs')
const {PythonShell} =  require('python-shell');
const bodyParser = require('body-parser');
const rdfParser = require("rdf-parse").default;
const $rdf = require('rdflib')
const cookieParser = require('cookie-parser')
const https = require("https");
const XLSX = require("xlsx");
//const office = require("office-js")
//const RdfString = require("rdf-string");
//const RdfStringTTL = require("rdf-string-ttl");
//const RdfDataModel = require("@rdfjs/data-model")


require('./db/mongoose')
const refugeeRouter = require(path.join(__dirname,'./routers/refugee'))
const dashboardRouter = require(path.join(__dirname,'./routers/dashboard'))
const excelRouter = require(path.join(__dirname,'./routers/excelRouter'))
const teacherPanelRouter = require(path.join(__dirname,'./routers/teacherPanel'))


const app = express();
app.use(bodyParser.text());
app.use(cookieParser())
const port =  process.env.PORT || 2000



const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(refugeeRouter)
app.use(dashboardRouter)
app.use(excelRouter)
app.use(teacherPanelRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
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

app.get('/validation', (req,res) =>{
  console.log('Cookies validation: ', req.headers.authorization , req.headers.refresh)
  let validation = {
    'isActive': true,
    'roles': ['Teacher']
  }

  res.json(validation)
})

app.get('/receiveCookies',validateCookie, (req,res)=>{
  //console.log('Cookies: ', req.cookies)
  res.send('Cookie done')
})

app.get(process.env.BASE_HREF_VAC || '/vac', validateCookie , (req, res) => { // '/'+process.env.BASE_HREF_VAC
  console.log('provide vac ui')
  res.render('index', { page: process.env.BASE_HREF_TP || 'teacherPanel' })
})

app.get(process.env.BASE_HREF_TP || '/teacherPanel', validateCookie ,(req,res)=>{ // '/'+process.env.BASE_HREF_TP
  console.log('provide tp ui')
  res.render('teacher',{ page: process.env.BASE_HREF_VAC || 'vac' } )
})

app.get('/test/'+process.env.BASE_HREF, (req,res) => {
  res.send("VAC is Running")
})


const HTMLtoDOCX = require('html-to-docx');





app.post('/HTMLtoDOC',(req,res) => {
  //console.log(req.body.HTMLDOC)
  //res.send('Docx file created successfully');
  (async () => {
    const fileBuffer = await HTMLtoDOCX(req.body.HTMLDOC, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    const filePath = './'+req.body.wordName;
    fs.writeFile(filePath, fileBuffer, (error) => {
      if (error) {
        res.send('Docx file creation failed');
        return;
      }
      res.send('Docx file created successfully');
    });
  })();
})


app.post('/damt',(req,res) => {

  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(__dirname, './ml_scripts/'),
    args: [req.body.Age, req.body.Gender, req.body.EducationLevel ,req.body.MotherTongue,path.join(__dirname, './ml_scripts/Trained_Models/output_TrainedModel')]
  };
  
  PythonShell.run('evaluation_v3.py', options, function (err, results) {
    if (err) throw err;
    console.log('DAMT results: %j', results);
    //console.log(results[5])
    //console.log(results[0])
    res.send(results[5])
  });
  //console.log(req.body)
})

app.get('/test/python',(req,res) => {
  let options = {
    mode: 'text',
    //pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(__dirname, './ml_scripts/'),
    args: ['value1', path.join(__dirname, './ml_scripts/Salary_Data.csv'), 'value3']
  };
  PythonShell.run('simple_linear_regression.py', options, function (err, results) {
    if (err) throw err;
    //console.log('results: %j', results);
    //console.log(results[0])
  });
  PythonShell.run('hello.py', options, function (err, results) {
    if (err) throw err;
    console.log('results: %j', results);
    console.log(results[0])
  });
  console.log("Pyhton")
  res.send("Python is Running")
})

/*

app.get('/data',(req, res) => {
    res.send(data);
})

const reader = require('xlsx');
const file = reader.readFile('C:/Users/gtzionis_local/Desktop/example.xlsx');
//console.log(workbook)

let data = []
  
const sheets = file.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}

const dataBuffer = fs.readFileSync('./public/data.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)

app.get('/refugeesByAttr', (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  Refugee.find({
    age:{
      $gte : from,
      $lt  : to
    }
  }).select("gender country_of_origin").then((refugees) => {
      res.json(refugees);
  }).catch((e) => {
      res.status(500).send()
  })
})


Refugee.insertMany([ 
  
]).then(function(){ 
  console.log("Data inserted")  // Success 
}).catch(function(error){ 
  console.log(error)      // Failure 
}); 
*/