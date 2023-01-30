let Agents = [] 
let range = []
let weight = 0
let TCNData = []
document.querySelector('#assigmentLCC').addEventListener('click', () => {
    document.querySelector('#buttonsFilters').insertAdjacentHTML('beforeend',` 
      <div>
          <button id="GroupButton" class="btn btn-light">Group them</button>
      </div>
    `)
    document.querySelector('#GroupButton').addEventListener('click',()=>{
        clearInterval(intervalId);
        document.querySelector('#tables').innerHTML=''
        document.querySelector('#buttonsFilters').innerHTML=''
        Agents.length=0
        DisplayFiltersAndGroupping()
    })
})

let DisplayFiltersAndGroupping = async () => {
    const res  = await fetch('/resultOfAssesesments')
    TCNData = await res.json()
    
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
                title: "Gender",
                data: "Gender"
            },
            { 
                title: "Nationality",
                data: "Nationality"
            },
            { 
                title: "Gender Preference",
                data: "LccGenderPreference"
            },
            { 
                title: "Nationality Preference",
                data: "LccNationPreference"
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

      let uniqueGender = (TCNData.map(obj => obj.Gender)).filter((v, i, a) => a.indexOf(v) === i) 
      let uniqueNation = (TCNData.map(obj => obj.Nationality)).filter((v, i, a) => a.indexOf(v) === i)
      document.querySelector('#buttonsFilters').insertAdjacentHTML('beforeend',
      `
      <div class="check-col-1 mt-2" style="border-top:1px solid black;">
        <div id="tcnFilters" class="check-col-5 pt-2">
            <div>
                <p>Gender
                <select id="gender-sel" class="border rounded">
                    <option value="none" selected="">-</option>
                </select>
                </p>
            </div>
            <div>
                <p>Nationality
                <select id="nation-sel" class="border rounded">
                    <option value="none" selected="">-</option>
                </select>
                </p>
            </div>
            <div>
            <!-- Default inline 1-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="radioIndividuals" name="radio-sel" checked>
                    <label class="custom-control-label" for="radioIndividuals">Individuals</label>
                </div>
                
                <!-- Default inline 2-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="radioAll" name="radio-sel">
                    <label class="custom-control-label" for="radioAll">All</label>
                </div>
            </div>
            <div>
                <p>
                    <label for="amount">Range of Group:</label>
                    <input type="text" id="amount" readonly style="border:0; font-weight:bold;">
                </p>
                <div id="slider-range-lcc" style="margin-bottom:0.8rem;"></div>
            </div>
            <div>
                <p>
                    <label for="amount2">Range:</label>
                    <input type="text" id="amount2" readonly style="border:0; font-weight:bold;">
                </p>
                <div id="slider-range-lcc-weight" style="margin-bottom:0.8rem; margin-left:1.8rem;"></div>
            </div>
        </div>
        <div class="col check-col-5 pt-2" id="tcnChecks"></div>
        <div><button id="startCoordination" class="btn btn-light mt-2">Start Coordination</button></div>
      </div>
      `
      )

      TCNData.forEach(element => {
        document.querySelector('#tcnChecks').insertAdjacentHTML('beforeend',`
            <div>   
                <input type="checkbox" id="${element.agentId}" value='{"agentUri":"${element.agentUri}", "Gender":"${element.Gender}", "Nationality":"${element.Nationality}", "agentId":"${element.agentId}"}'>
                <label>${element.Name}</label>
            </div>
            `)
        });
        uniqueGender.forEach(element => {
            document.querySelector('#gender-sel').insertAdjacentHTML('beforeend',
            `
                <option value="${element}">${element}</option>
            `
            )
        });
        uniqueNation.forEach(element => {
            document.querySelector('#nation-sel').insertAdjacentHTML('beforeend',
            `
                <option value="${element}">${element}</option>
            `
            )
        });

        range[0]=1
        range[1]=TCNData.length
        
        $( function() {
            $( "#slider-range-lcc" ).slider({
              range: true,
              min: 1,
              max: TCNData.length,
              values: [ 1, TCNData.length ],
              slide: function( event, ui ) {
                $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                range[0]=ui.values[ 0 ]
                range[1]=ui.values[ 1 ]
              }
            });
            $( "#amount" ).val( "" + $( "#slider-range-lcc" ).slider( "values", 0 ) +
              " - " + $( "#slider-range-lcc" ).slider( "values", 1 ) );
          } );
         
          weight = 0

          $( function() {
            $( "#slider-range-lcc-weight" ).slider({
              range: "min",
              value: 0,
              min: 0,
              max: 1,
              step: 0.01,
              slide: function( event, ui ) {
                $( "#amount2" ).val( "" + ui.value );
                weight = ui.value
              }
            });
            $( "#amount2" ).val( "" + $( "#slider-range-lcc-weight" ).slider( "value" ) );
          } );

        $('input[name="radio-sel"]').on('click change', function() {
            if(this.id=='radioIndividuals'){
                $( '#tcnChecks input[type="checkbox"]' ).prop('checked',false)
                document.querySelector('#gender-sel')[0].selected = true
                document.querySelector('#nation-sel')[0].selected = true
                let checkboxes = document.querySelectorAll('input[type="checkbox"]')
                checkboxes.forEach(element => {
                    element.disabled = false 
                });
            }else{
                $( '#tcnChecks input[type="checkbox"]' ).prop('checked', true)
                document.querySelector('#gender-sel')[0].selected = true
                document.querySelector('#nation-sel')[0].selected = true
                let checkboxes = document.querySelectorAll('input[type="checkbox"]')
                checkboxes.forEach(element => {
                    element.disabled = false 
                });
            }
        });

        document.querySelector('#gender-sel').addEventListener('change', function (e) {
            console.log(document.querySelector('#nation-sel').value)
            let checkboxesGender = document.querySelectorAll('input[type="checkbox"]')
            if(e.target.value!='none'){
                //console.log(checkboxesGender[0].checked)
                checkboxesGender.forEach((element,i) =>  {
                    //console.log(element.value)
                    let tcnObj = JSON.parse(element.value);
                    if(e.target.value!=tcnObj.Gender){
                        //console.log('disable',i)
                        checkboxesGender[i].disabled=true
                        checkboxesGender[i].checked=false
                    }else{
                        if(document.querySelector('#nation-sel').value=='none'){
                            checkboxesGender[i].disabled=false
                        }else if(document.querySelector('#nation-sel').value==tcnObj.Nationality && e.target.value==tcnObj.Gender){
                            checkboxesGender[i].disabled=false
                        }
                        //console.log('enable',i)
                        
                    }
                })
                //checkboxesGender[0].checked=true
            }else{
                checkboxesGender.forEach((element,i) =>  {
                    let tcnObj = JSON.parse(element.value)
                    if(e.target.value=='none' && document.querySelector('#nation-sel').value==tcnObj.Nationality){
                        checkboxesGender[i].disabled=false
                    }else if( e.target.value=='none' && document.querySelector('#nation-sel').value=='none' ){
                        checkboxesGender[i].disabled=false
                    }  
                })
            }
        })

        document.querySelector('#nation-sel').addEventListener('change', function (e) {
            console.log(document.querySelector('#gender-sel').value)
            let checkboxesNation = document.querySelectorAll('input[type="checkbox"]')
            if(e.target.value!='none'){
                //console.log(checkboxesGender[0].checked)
                checkboxesNation.forEach((element,i) =>  {
                    //console.log(element.value)
                    let tcnObj = JSON.parse(element.value);
                    if(e.target.value!=tcnObj.Nationality){
                        //console.log('disable',i)
                        checkboxesNation[i].disabled=true
                        checkboxesNation[i].checked=false
                    }else{
                        if(document.querySelector('#gender-sel').value=='none'){
                            checkboxesNation[i].disabled=false
                        }else if(document.querySelector('#gender-sel').value==tcnObj.Gender && e.target.value==tcnObj.Nationality){
                            checkboxesNation[i].disabled=false
                        }
                        //console.log('enable',i)
                    }
                })
                //checkboxesGender[0].checked=true
            }else{
                checkboxesNation.forEach((element,i) =>  {
                    let tcnObj = JSON.parse(element.value)
                    if(e.target.value=='none' && document.querySelector('#gender-sel').value==tcnObj.Gender){
                        checkboxesNation[i].disabled=false
                    }else if(e.target.value=='none' && document.querySelector('#gender-sel').value=='none' ){
                        checkboxesNation[i].disabled=false
                    }
                })
            }
        })




        document.querySelector('#startCoordination').addEventListener('click', async () => {
            
            let selected =[]
            $('#tcnChecks input:checked').each(function() {
                let tcnObj = JSON.parse($(this).attr('value'))
                Agents.push(tcnObj);
            })
            //change the status of agents
            //console.log(Agents)
            //console.log(range)
            let hasParticipants = ""
            Agents.forEach(element => {
                hasParticipants = hasParticipants+'"'+element.agentId+'",'
            });
            hasParticipants = hasParticipants.slice(0,-1)
            //console.log(hasParticipants)
            let resBody =   'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
                            'PREFIX welcome: <https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#> '+
                            '_:bnode_lccUseCase	rdf:type   			 welcome:LCCUseCase ; '+
                            'welcome:hasParticipants		'+hasParticipants+'; '+
                            'welcome:hasLessonId    	 	"'+LID+'"^^xsd:integer; '+
                            'welcome:hasDedicatedAgent  	 "'+Agents[0].agentId+'"; '+
                            'welcome:hasId      		 "'+LCCID+'"^^xsd:string; '+
                            'welcome:hasCPLWeight   		 "'+weight+'"^^xsd:float; '+
                            'welcome:hasMinSize		 "'+range[0]+'"^^xsd:integer ; '+
                            'welcome:hasMaxSize		 "'+range[1]+'"^^xsd:integer ; '+
                            'welcome:hasAbsenceAllowance	 "1"^^xsd:integer .'
            
            
            let ag =  Agents.map(obj=>obj.agentId)              
            let final = {dedicatedAgent:ag,Group:resBody}
            
            fetch('/groupOfTCNs', {
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
            document.querySelector('#tables').innerHTML=''
            document.querySelector('#buttonsFilters').innerHTML=''
            //let groupsAgents = await fetch(/)
            let intervalIdGroups = setInterval(async function() {
                //console.log('5s')
                const res  = await fetch('/resultsOfGroups')
                let groupData = await res.json()
                if(groupData.length==0){
                    //console.log('continue')
                }else{
                    clearInterval(intervalIdGroups)
                    //console.log('stop')
                    manipulationOfGroups(groupData)
                }
            }, 1000);
        })

}
    