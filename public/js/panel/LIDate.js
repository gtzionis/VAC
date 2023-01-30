let intervalId
let LID = ""
let LCCID = ""
$( function() {
    $( "#datepicker" ).datetimepicker();
  } );

  document.querySelector('#assigmentLCC').addEventListener('click', async (e) => {
    let jsDate = $('#datepicker').datetimepicker('getDate')
    LID = $('#lessons').val()
    LCCID = Date.now()
    if(!$("#datepicker").val()){
        jsDate.value(new Date());
    }

    let resBody = '<https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#'+LCCID+'>'+
    ' a <https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#LCCLesson>; '+
    '   <https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#hasAssessmentDeadline> '+
    '  "'+jsDate.toISOString()+'"^^<http://www.w3.org/2001/XMLSchema#dateTime>; '+
    ' <https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#hasLessonId> '+LID+' .'
    
    let final = {Classroom:document.querySelector('#classrooms').value,Assessment:resBody}

    fetch('/assessment', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(final) ,
    redirect: 'follow'
    })
    .then(response => { return response.text()})
    .then(data => {
    //console.log(data);
    })
    .catch((error) => {
    console.error('Error:', error);
    });

  
  intervalId = setInterval(async function() {
    //console.log('5s')
    const res  = await fetch('/resultOfAssesesments')
    let TCNData = await res.json()
    $('#tableOfTCNs').dataTable().fnClearTable();
    $('#tableOfTCNs').dataTable().fnDestroy();
    document.querySelector('#tables').innerHTML=''
    document.querySelector('#tables').insertAdjacentHTML('beforeend',
    `<table id="tableOfTCNs" class="display" style="width:100%; top:1rem;">
                        
    </table>
    `
    )

      $('#tableOfTCNs').DataTable( {
        data: TCNData,
        columns: [
            { 
              title: "Name",
              data: "Name"
            },
            { 
              title: "Assessment Score",
              data: "AssessmentScore"
            },
            { 
              title: "Reading",
              data: "ReadingScore"
            },
            { 
              title: "Writting",
              data: "WritingScore"
            },
            { 
              title: "Listening",
              data: "ListeningScore"
            },
            { 
              title: "Vocabulary",
              data: "VocabularyScore"
            },
        ]
      });
      }, 5000);
})


