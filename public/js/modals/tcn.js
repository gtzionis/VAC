//select classes
let columnTCN = 1
let tcnData = []
let selectFunction = false

let TCNS = async () => {
    const res  = await fetch('/refugees/Classroom')//take all the classes
    let data = await res.json()
    let classes = []
    data.forEach(element => {
        classes.push(element.Classroom)
    });
    let uniqueData = classes.filter((v, i, a) => a.indexOf(v) === i)
    let dashSelections = document.querySelector("#class-sel")
    uniqueData.forEach(element => {
      dashSelections.insertAdjacentHTML('beforeend',`<option value="${element}">${element}</option>`)  
    })
}

TCNS()
//select students of class
document.querySelector("#class-sel").addEventListener("change", async (e) =>{
    const res  = await fetch('SelectAttr?attr=Name&attr=Classroom&attr=UserId')//take all the students from a class id and name
    let clas = await res.json()
    document.querySelector("#tcn-sel").innerHTML=""
    clas.forEach(element => {
        if(element.Classroom==e.target.value){
            document.querySelector("#tcn-sel").insertAdjacentHTML('beforeend',`<option id="${element.UserId}" value="${element.Name}">${element.Name}</option>`)   
        }
    });
})
//TCN's dash
document.querySelector("#search-tcn").addEventListener("click", async (e) =>{
          columnTCN = 1
          $("#tcnModal").modal('show')
          document.querySelector("#tcnBody").innerHTML=""
          document.querySelector("#sc1").innerHTML=""//remove all the html from the previous tcn
          document.querySelector("#sc2").innerHTML=""
          document.querySelector("#sc3").innerHTML=""
          
          let selected = document.querySelector("#tcn-sel")

          if(selected.options[selected.selectedIndex].value!='none'){
            
            const tcn = await fetch('/refugee/one?label='+selected.options[selected.selectedIndex].id)//take the data from a specific tcn
            tcnData = await tcn.json()//append the static fields
            const tcnMini = await fetch('/SelectAttr?attr=Minigame.score&attr=Minigame.time&attr=Minigame.minigameID&attr=UserId&attr=Name')
            let tcnMiniData = await tcnMini.json()
            const tcnAssess = await fetch('/SelectAttr?attr=UserId&attr=Name&attr=Assessment.LessonId&attr=Assessment.AssessmentScore&attr=Assessment.ListeningScore&attr=Assessment.VocabularyScore&attr=Assessment.WritingScore&attr=Assessment.ReadingScore')
            let tcnAssessData = await tcnAssess.json()
            const tcnVRSce = await fetch('/SelectAttr?attr=UserId&attr=Name&attr=ApplicationForm.scenarioID&attr=ApplicationForm.stage&attr=ApplicationForm.stagescore&attr=ApplicationForm.stagetime&attr=ApplicationForm.attempts')
            let tcnVRSceData = await tcnVRSce.json()

            $( function() {
                $( "#accordion" ).accordion({
                  collapsible: true,
                });
              } );

            $( function() {
                $( "#accordion1" ).accordion({
                  collapsible: true,
                  active: false
                });
              } );

              $( function() {
                $( "#accordion2" ).accordion({
                  collapsible: true,
                  active: false
                });
              } );

              $( function() {
                $( "#accordion3" ).accordion({
                  collapsible: true,
                  active: false
                });
              } );

              $( function() {
                $( "#accordion4" ).accordion({
                  collapsible: true,
                  active: false,
                  heightStyle: "content"
                });
              } );

              console.log(tcnData[0])
            document.querySelector("#tcnBody").insertAdjacentHTML("beforeend",`
            <div id="accordion">
            <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">TCN</span>
            <div class="check-col-3" id="stats-tcn">
                <div><b>Name:</b> ${selected.options[selected.selectedIndex].value}</div>
                <div><b>Education Level:</b> ${tcnData[0].EducationLevel}</div>
                <div><b>Gender:</b> ${tcnData[0].Gender}</div>
                <div><b>Classroom:</b> ${tcnData[0].Classroom}</div>
                <div></div>
                <div></div>
            </div>
            </div>
            <div id="accordion1" class="check-col-1">
                    
                        <span class="badge badge-secondary" style="font-size:0.9rem;">Minigames</span>
                        <table id="table-mini" class="display" style="width:100%; top:1rem;">
                                
                        </table>
            </div>
            <div id="accordion2" class="check-col-1">            
                    
                        <span class="badge badge-secondary" style="font-size:0.9rem;">Assessments</span>
                        <table id="table-assess" class="display" style="width:100%; top:1rem;">
                                
                        </table>
            </div>  
            <div id="accordion3" class="check-col-1">
                    
                        <span class="badge badge-secondary" style="font-size:0.9rem;">VR Scenarios</span>
                        <table id="table-vrsce" class="display" style="width:100%; top:1rem;">
                                
                        </table>
            </div>
            <div id="accordion4" class="check-col-1">
                    
                        <span class="badge badge-secondary" style="font-size:0.9rem;">Recommendation</span>
                        <div id="damt"> </div>
            </div>              
            `)
            
            let dtMini = tcnMiniData.filter(obj => obj.UserId == selected.options[selected.selectedIndex].id)
            $('#table-mini').DataTable( {
                data: dtMini.map(obj => obj.Minigame)[0],
                columns: [
                    {
                        title:"Minigame",
                        data:"minigameID"
                    },
                    { 
                        title: "Score",
                        data:"score"
                    },
                    {
                        title:"Time",
                        data:"time"
                    }
                ]
              });
              
              let dtAssess = tcnAssessData.filter(obj => obj.UserId == selected.options[selected.selectedIndex].id)
              $('#table-assess').DataTable( {
                  data: dtAssess.map(obj => obj.Assessment)[0],
                  columns: [
                      {
                          title:"Lesson",
                          data:"LessonId"
                      },
                      { 
                          title: "Assessment Score",
                          data:"AssessmentScore"
                      },
                      {
                          title:"Listening Score",
                          data:"ListeningScore"
                      },
                      {
                        title:"Vocabulary Score",
                        data:"VocabularyScore"
                    },
                    {
                        title:"Writing Score",
                        data:"WritingScore"
                    }, 
                    {
                        title:"Reading Score",
                        data:"ReadingScore"
                    }
                  ]
                });
                
                let dtVRSce = tcnVRSceData.filter(obj => obj.UserId == selected.options[selected.selectedIndex].id)
                $('#table-vrsce').DataTable( {
                    data: dtVRSce.map(obj => obj.ApplicationForm)[0],
                    columns: [
                        {
                            title:"Scenario",
                            data:"scenarioID"
                        },
                        { 
                            title: "Stage",
                            data:"stage"
                        },
                        {
                            title:"Stage Score",
                            data:"stagescore"
                        },
                        {
                          title:"Stage Time",
                          data:"stagetime"
                      },
                      {
                          title:"Attempts",
                          data:"attempts"
                      }
                    ]
                  });
    
            let final = { Age: tcnData[0].Age, Gender: tcnData[0].Gender, EducationLevel: tcnData[0].EducationLevel ,MotherTongue: tcnData[0].MotherTongue , dtAssess:dtAssess}
            fetch('/damt', {
              method: 'POST', // or 'PUT'
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(final) ,
              redirect: 'follow'
              })
              .then(response => {return response.text()})
              .then(data => {
              if(data==2){
                //console.log('2')
                document.querySelector('#damt').insertAdjacentHTML("beforeend",`<p>The TCN with these characteristics is categorized to class '2' and is expected to assimilate most of the lessons
                However, vocabulary and spelling exercises can be recommended to fix the knowledge 
                (not compulsory).</p>`)
              }else if(data==1){
                document.querySelector('#damt').insertAdjacentHTML("beforeend",`<p>The TCN with these characteristics is categorized to class '1' .The TCN is expected to assimilate most of the lessons, 
                however he/she should work on some aspects such as vocabulary, 
                spelling, and grammar. Mandatory some of the exercises of the teacher's choice.</p>`)
              }else{
                document.querySelector('#damt').insertAdjacentHTML("beforeend",`<p>TCN with these characteristics is categorized to class '0'.The TCN is not expected to assimilate the concepts. 
                In order to make further progress, he/she should repeat the vocabulary, 
                grammar and spelling exercises. 
                Mandatory to repeat all exercises. 
                In addition, teacher can add some exercises if she/he considers.</p>`)
              }
              })
              .catch((error) => {
              console.error('Error:', error);
          });       
        }   
})

document.querySelector("#tcnClose").addEventListener("click", (e)=>{
    val = "none"
    document.querySelector('#tcn-sel [value="' + val + '"]').selected = true;
})

document.querySelector("#tcnCreateChart").addEventListener("click", (e) =>{
    $("#tcnModal").modal('hide')
    $("#ModalLabelFilterTCN").modal('show');
    $(".name-TCN").remove()
    $(".checks-TCN").remove()
    $( '#vrsce input[type="checkbox"]' ).prop('disabled',false)
    $( '#assess input[type="checkbox"]' ).prop('disabled',false)
    $( '#mini input[type="checkbox"]' ).prop('disabled',false)
    checkedLL = 0
    numUncheckedLL = 0
    document.querySelector(".section-check").innerHTML=""
    $('input[type="checkbox"]:checked').prop('checked',false);
    finalObj.length=0
    checkedArray.length=0
})

$("#attrTCN input:checkbox").change(async function() {
    if(this.checked== true) {
        if(this.value.includes('Minigame')){
            checkedLL = checkedLL + 1
            $( '#vrsce input[type="checkbox"]' ).prop('disabled',true)
            $( '#assess input[type="checkbox"]' ).prop('disabled',true)
          }else if(this.value.includes('ApplicationForm')){
            checkedLL = checkedLL + 1
            $( '#mini input[type="checkbox"]' ).prop('disabled',true)
            $( '#assess input[type="checkbox"]' ).prop('disabled',true)
          }else if(this.value.includes('Assessment')){
            checkedLL = checkedLL + 1
            $( '#vrsce input[type="checkbox"]' ).prop('disabled',true)
            $( '#mini input[type="checkbox"]' ).prop('disabled',true)
          }
    
        obj = {
            name: "",
            keys: [],
            data: [],
            needed: [],
            nums: [],
            range:[], 
            bins:1,
            category: 'categorical',
            numsNumerical:[],
            mode:"",
            metric:false,
            transition:false,
            insideObj:false,
            excel:"none"
          }

        checkedArray.push(this.value)
        const res  = await fetch('/refugees/'+this.value)
        let Rdata = await res.json()
        
        let colData =[] 
        if(this.value.includes(".")){
            let objTable = []
            let objTable2 = []
            let n = this.value.lastIndexOf('.')
            Rdata.forEach(activities => {
                objTable.push(Object.values(activities))
            })
            let dimensions = Array.isArray(objTable[0][0])
            if(dimensions){
                for(let i=0;i<objTable.length;i++){
                    objTable2.push(getFields(objTable[i][0],this.value.substring(n + 1)))
                }
            }else{
                for(let i=0;i<objTable.length;i++){
                    objTable2.push(getFields(objTable[i],this.value.substring(n + 1)))
                }
            }
            colData = objTable2.map(Object.values) 
        }else{
            colData = getFields(Rdata,this.value)
        }

        let uniqueData = []
        let mergeResult = []
        if(typeof colData[0] == 'object'){
            colData.forEach(element => {
                mergeResult = mergeResult.concat(element)
            })
            colData.length=0
            colData=mergeResult
            uniqueData = mergeResult.filter((v, i, a) => a.indexOf(v) === i)
        }else{
            uniqueData = colData.filter((v, i, a) => a.indexOf(v) === i)
            if(typeof colData[0] == 'number'){
                obj.category='number'
            }
        }

        $(".checks-TCN").remove()
        $(".name-TCN").remove()
        $(".section-check-TCN").append(`<p class="name-TCN">${this.value}</p><div class="checks-TCN check-col-3"></div>`)
        if(typeof uniqueData[0]==='string'){// take into account th type of the dta that we have to proccess
          uniqueData.forEach(element => {
              $(".checks-TCN").hide().append(`<div><label><input type="checkbox" id="${element}" value="${element}" name="${va}">
                                  ${element}</label></div>`).fadeIn(350)
          })
        }else if(this.value=='Student'){
            
        }else{
            obj.category='number'
            let maxn = Math.max(...colData)
            let minn = Math.min(...colData)
            obj.range[0]=minn
            obj.range[1]=maxn
            $(".checks-TCN").append(`
            <p>
              <label for="amount">Range:</label>
              <input type="text" id="amount" readonly style="border:0; font-weight:bold;">
            </p>
            <div id="slider-range" style="margin-top:0.8rem;"></div>
            <p>
              <label>Bins: </label>
              <input type="text" value="1" id="step" style="border:0;">
            </p>
            `)
            //slider for the numerical data. setting the bins and the max min  
            $( function() {
              $( "#slider-range" ).slider({
                range: true,
                min: minn,
                max: maxn,
                values: [ minn, maxn ],
                slide: function( event, ui ) {
                  $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                  obj.range[0]=ui.values[ 0 ]
                  obj.range[1]=ui.values[ 1 ]
                }
              });
              $( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) +
                " - " + $( "#slider-range" ).slider( "values", 1 ) );
            } );
            document.querySelector('#step').addEventListener('change',function(){
              obj.bins=document.querySelector('#step').value
            })  
        }
        
        //checks what values will be needed or not checks and unchecks
        $(document).on('change', '.checks-TCN :checkbox', function() {
          if(this.checked == true) {
            obj.needed.push(this.value)
          }
          if(this.checked == false){
            obj.needed.splice(obj.needed.findIndex(name => name == this.value),1)
            if(this.value.includes('Minigame')){
                numUncheckedLL=numUncheckedLL+1
                if(numUncheckedLL==checkedLL){
                  $( '#vrsce input[type="checkbox"]' ).prop('disabled',false)
                  $( '#assess input[type="checkbox"]' ).prop('disabled',false)
                }
              }else if(this.value.includes('ApplicationForm')){
                if(numUncheckedLL==checkedLL){
                  $( '#mini input[type="checkbox"]' ).prop('disabled',false)
                  $( '#assess input[type="checkbox"]' ).prop('disabled',false)
                }
              }else if(this.value.includes('Assessment')){
                if(numUncheckedLL==checkedLL){
                  $( '#vrsce input[type="checkbox"]' ).prop('disabled',false)
                  $( '#mini input[type="checkbox"]' ).prop('disabled',false)
                }
              }
          }
          //console.log(ne)
        })
        
        obj.name=this.value
        obj.keys=uniqueData.map(obj =>  obj)
        
        finalObj.push(obj)
        
        uniqueData.length=0
        colData.length=0

    }else if(this.checked==false){
        checkedArray.splice(checkedArray.findIndex(obj => obj == this.value),1)
        finalObj.splice(finalObj.findIndex(obj => obj.name == this.value),1)
    }
    if(checkedArray.length>3){
        if(checkedArray.some(str => str == 'Student')){
            if(checkedArray.length == 5){
                checkedArray.length=0
                $("#ModalLabelFilterTCN").modal('hide')
                $("#tcnModal").modal('show')
            }
        }else{
            checkedArray.length=0
            $("#ModalLabelFilterTCN").modal('hide')
            $("#tcnModal").modal('show')
        }
       
    }
})

document.querySelector('#searchFilterTCN').addEventListener('click', async (e) =>{
    
    if(checkedArray.some(str => str == 'Student')){
        document.querySelector("#inlineRadio1TCN").removeAttribute('checked')
        document.querySelector("#inlineRadio2TCN").setAttribute('checked','')
    }else{
        document.querySelector("#inlineRadio2TCN").removeAttribute('checked')
        document.querySelector("#inlineRadio1TCN").setAttribute('checked','')
    }

    let ur = ""
    
    let classroom = document.querySelector('#class-sel').value
    checkedArray.forEach(element => {
        ur=ur+"attr="+element+"&"
    });
    const res  = await fetch('/SelectAttr?'+ur.slice(0,-1)+'&attr=Classroom')
    let Rdata = await res.json()
    let RdataClass = Rdata.filter(obj => obj.Classroom == classroom)
    console.log(RdataClass)
    for(let i=0; i<checkedArray.length;i++){
        
        let uniqueNeeded = finalObj[i].needed.filter((v, i, a) => a.indexOf(v) === i)
        finalObj[i].needed.length=0
        finalObj[i].needed = uniqueNeeded

        let colData =[] 
        if(checkedArray[i].includes(".")){
            let objTable = []
            let objTable2 = []
            let n = checkedArray[i].lastIndexOf('.')
            
            objTable = _.map(RdataClass, _.property(checkedArray[i].substring(0,n)))
            if(Array.isArray(objTable[0])){
                objTable.forEach(element => {
                    objTable2.push(_.map(element, _.property(checkedArray[i].substring(n + 1)))) 
                })
                finalObj[i].insideObj=true
            }
            colData = objTable2
        }else{
            colData = getFields(RdataClass,checkedArray[i])
            if(Array.isArray(colData[0])){
                finalObj[i].insideObj=true
            }
        }
        finalObj[i].data = colData

        if(finalObj[i].category=='categorical'){
            //if needed == 0 then take all the keys
            if(finalObj[i].needed.length==0){
              finalObj[i].needed = finalObj[i].keys
            }
          }else{//this is where we have to create the ranges [10=min,20=max] bins=5 => [[10,15][15,20]] ;) 
            let stepsArray = new Array()
            let steps=finalObj[i].range[0]
            while (steps<=finalObj[i].range[1]) {
              steps=steps+parseInt(finalObj[i].bins)
              stepsArray.push(new Array(steps-parseInt(finalObj[i].bins),steps))
            }
            for(let x=0;x<stepsArray.length-1;x++){
              //labelsO.push(stepsArray[i][0]+"-"+stepsArray[i][1])
              if(x==0){finalObj[i].needed.push(stepsArray[x][0]+"-"+stepsArray[x][1])}
              else{finalObj[i].needed.push(">"+stepsArray[x][0]+"-"+stepsArray[x][1])}
              finalObj[i].numsNumerical.push(new Array(stepsArray[x][0],stepsArray[x][1]))
            }
            finalObj[i].numsNumerical[0][0]=finalObj[i].numsNumerical[0][0]-1
          }  
    }
   
    if(finalObj.find(obj => obj.insideObj ==true)){
        let indicesTrue = finalObj.map((e, i) => e.insideObj === true ? i : '').filter(String)
        let indicesFalse = finalObj.map((e, i) => e.insideObj === false ? i : '').filter(String)
        let insObjRes = []
        if(indicesTrue.length!=0){
            
                let indicesTrueLen = finalObj[indicesTrue[0]].data.map(obj => obj.length)
                for(let i=0;i<indicesFalse.length;i++){
                    insObjRes.length = 0
                    for(let j=0;j<finalObj[indicesTrue[0]].data.length;j++){
                        insObjRes.push(dublicateItems([finalObj[indicesFalse[i]].data[j]],indicesTrueLen[j]))
                    }
                    finalObj[indicesFalse[i]].data.length = 0
                    finalObj[indicesFalse[i]].data = insObjRes
                    concatMerge(finalObj[indicesFalse[i]])
                }
                for(let i=0;i<indicesTrue.length;i++){
                    concatMerge(finalObj[indicesTrue[i]])
                }
        }
    }
    //----------------------------------------
    
    $("#ModalLabelFilterTCN").modal('hide')
    
        selectFunction = false
        document.querySelector('#inlineRadio1TCN').removeAttribute("disabled")
        if(finalObj.some(obj => obj.category == 'number')){
            selectionTCN(finalObj,'selectTCNMetric')
        }else{
            $("#tcnModal").modal('show')
            let chart = $("#chartTCN" ).val()
            let ids = chart+'-'+Date.now()
            $("#sc"+columnTCN).append(`<canvas class="chart shadow-lg"  draggable="true" id="${ids}" width="20rem" height="22rem"></canvas>`)
            columnTCN++
            if(columnTCN==4){columnTCN=1}
            createChart(chart,ids,finalObj)
        }
})

