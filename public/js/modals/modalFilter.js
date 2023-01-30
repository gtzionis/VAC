//Script for load data from the checks and build the chart objects
//one fetch per check
//fibalObject
//every time we click on the button for this modal we clear the finalObj
//finalObj is an array of objects
let columnData = []
let va = ''
let finalObj = []
let checkedArray = []
let checkedLL = 0
let numUncheckedLL = 0

let obj = {
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

$(document).ready(function(){
    $("#tcn-g-p").click(function(){
      $("#filters").modal('show');
      //console.log('open')
      $(".name").remove()
      $(".checks").remove()
      $( '#vrsce input[type="checkbox"]' ).prop('disabled',false)
      $( '#assess input[type="checkbox"]' ).prop('disabled',false)
      $( '#mini input[type="checkbox"]' ).prop('disabled',false)
      document.querySelector(".section-check").innerHTML=""
      $('input[type="checkbox"]:checked').prop('checked',false);
      finalObj.length=0
      checkedArray.length=0
      checkedLL = 0
      numUncheckedLL = 0
    });
  });
  
  $(document).ready(function(){
    $("#searchFilter").click(function(){
      $("#filters").modal('hide');
    });
  });

  $("#attr input:checkbox").change(async function() {
    
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
        const res  = await fetch('refugees/'+this.value)
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
        }
        
        if(typeof colData[0] == 'number'){
          obj.category='number'
        }

        //console.log(columnData) // uniqueData only the unique values from the array
        //console.log(uniqueData)
        $(".checks").remove()
        $(".name").remove()
        $(".section-check").append(`<p class="name">${va}</p><div class="checks check-col-3"></div>`)
        if(typeof uniqueData[0]==='string'){// take into account th type of the dta that we have to proccess
          uniqueData.forEach(element => {
              $(".checks").hide().append(`<div><label><input type="checkbox" id="${element}" value="${element}" name="${va}">
                                  ${element}</label></div>`).fadeIn(350)
          })
        }else{//only when we have numerical
          let maxn = Math.max(...colData)
          let minn = Math.min(...colData)
          obj.range[0]=minn
          obj.range[1]=maxn
          $(".checks").append(`
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
        $(document).on('change', '.checks :checkbox', function() {
          if(this.checked == true) {
            obj.needed.push(this.value)
          }
          if(this.checked == false){
            obj.needed.splice(obj.needed.findIndex(name => name == this.value),1)
          }
          //console.log(ne)
        })
        //setting up the values to the object
        obj.name=this.value
        obj.keys=uniqueData.map(obj =>  obj)

        finalObj.push(obj)
        
        uniqueData.length=0
        colData.length=0

     }else if(this.checked==false){
        checkedArray.splice(checkedArray.findIndex(obj => obj == this.value),1)
        finalObj.splice(finalObj.findIndex(obj => obj.name == this.value),1)
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

    //after 3 checks hides the modals
    if(finalObj.length>3){
      finalObj.length=0
      checkedArray.length=0
      $("#filters").modal('hide');
    }
    //console.log(finalObj)
})
//I should also about this
$(document).on('click','#searchFilter',async function(){//defing the needed fields
  
  let ur = ""
  checkedArray.forEach(element => {
      ur=ur+"attr="+element+"&"
  }); 
  const res  = await fetch('/SelectAttr?'+ur.slice(0,-1))
  let Rdata = await res.json()

  for(let i=0; i<checkedArray.length;i++){
    let uniqueNeeded = finalObj[i].needed.filter((v, i, a) => a.indexOf(v) === i)
    finalObj[i].needed.length=0
    finalObj[i].needed = uniqueNeeded
    
    let colData =[] 
    if(checkedArray[i].includes(".")){
      let objTable = []
      let objTable2 = []
      let n = checkedArray[i].lastIndexOf('.')
      
      objTable = _.map(Rdata, _.property(checkedArray[i].substring(0,n)))
      if(Array.isArray(objTable[0])){
          objTable.forEach(element => {
              objTable2.push(_.map(element, _.property(checkedArray[i].substring(n + 1)))) 
          })
          finalObj[i].insideObj=true
      }
      colData = objTable2
  }else{
      colData = getFields(Rdata,checkedArray[i])
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
      console.log(finalObj)
      
      let chart = $("#chart" ).val()

      if(finalObj.some(obj => obj.category == 'number')){
        dis() 
        $("#selectMetric .modeOptions").remove()
         for(let i=0;i<finalObj.length;i++){
             if(finalObj[i].category=='number'){
                 $("#modeModal").modal('show');
                 let nameL = finalObj[i].name.replace("Activities.","")
                 nameL = nameL.replace(/([A-Z])/g, ' $1').trim()
                 document.querySelector("#selectMetric").insertAdjacentHTML('beforeend',
                 `<option class="modeOptions" id="sel-${i}" value="${finalObj[i].name}">${nameL}</option>`
                 )
             }
         }
         document.querySelector("#modeSubmit").addEventListener("click",(e) =>{
          let mode = $('#modeSelection input:radio:checked').val()
          let metricSel = document.querySelector("#selectMetric").value
          let num=Date.now()
          finalObj.forEach(element => {
              element.mode = mode
              if(metricSel==element.name){
                  element.metric = true
                  ids = chart+'-'+num
                  $("#searchCol").append(`<canvas class="chart shadow-lg"  draggable="true" id="${ids}" width="20rem" height="22rem"></canvas>`)//first we have to put the HTML and then t chart
                  dashboardCharts(ids)//to store it if we want to create a dashboard
                  createChart(chart,ids,finalObj)//to create the chart
                  move()
              }
          });
          finalObj.length = 0
        })
  }else{
    $(document).ready(function(){
      let num=Date.now()
      ids = chart+'-'+num
      $("#searchCol").append(`<canvas class="chart shadow-lg"  draggable="true" id="${ids}" width="20rem" height="22rem"></canvas>`)//first we have to put the HTML and then t chart
      dashboardCharts(ids)//to store it if we want to create a dashboard
      createChart(chart,ids,finalObj)//to create the chart
      move()
    });
  }
})
