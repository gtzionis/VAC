$(document).ready(function(){
    $("#excelBtn").click(async function(){
      $("#excelModal").modal('show');
      //console.log('open')
      document.querySelector("#excelFiles").innerHTML=""
      document.querySelector('#excelAttributes').innerHTML=""
      document.querySelector('#excelValues').innerHTML=""
      document.querySelector("#excelFiles").insertAdjacentHTML("beforeend",`<option value="none" selected="">-</option>`)
      const res  = await fetch('/excelNames')
      let excels = await res.json()
      //console.log(excels)
      finalObj.length=0
      checkedArray.length=0
      checkedLL = 0
      numUncheckedLL = 0
      excels.forEach(element => {
        document.querySelector("#excelFiles").insertAdjacentHTML('beforeend',`<option id="${element._id}" value="${element.excelName}">${element.excelName}</option>
          `)  
      })
    });
  });

  document.querySelector("#excelFiles").addEventListener("change", async (e) =>{
    let selected = document.querySelector("#excelFiles")
    //console.log(selected.options[selected.selectedIndex].id)
    if(selected.options[selected.selectedIndex].value != "none"){
      document.querySelector("#deleteExcel").classList.remove('disabled')
    }else{
      document.querySelector("#deleteExcel").classList.add('disabled')
    }
    document.querySelector('#excelAttributes').innerHTML=""
    const res  = await fetch('/excelFields/'+selected.options[selected.selectedIndex].id)
    let excel = await res.json()
    //console.log(Object.keys(excel.data[0]))
    Object.keys(excel.data[0]).forEach(element => {
      $("#excelAttributes").hide().append(`<div><label><input type="checkbox" id="${element}" value="${element}" name="${element}">
      ${element}</label></div>`).fadeIn(350)
    })
  })

  $(document).on('change', '#excelAttributes :checkbox', async function() {
    
    
    if(this.checked== true) {

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

        const res  = await fetch('/excel/'+document.querySelector("#excelFiles").options[document.querySelector("#excelFiles").selectedIndex].id+'/'+this.value)
        let excelData = await res.json()
        //console.log(excelData)
        obj.excel = document.querySelector("#excelFiles").options[document.querySelector("#excelFiles").selectedIndex].id
        checkedArray.push(this.value)
        let colData =[]
        colData = getFields(excelData.data,this.value)

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

        $(".checks").remove()
        $(".name").remove()
        $("#excelValues").append(`<p class="name">${va}</p><div class="checks check-col-3"></div>`)
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
  }

  //after 3 checks hides the modals
  if(finalObj.length>3){
    finalObj.length=0
    checkedArray.length=0
    $("#excelModal").modal('hide');
  }
  //console.log(finalObj)      
        
  })

  $(document).on('click','#createChartExcel',async function(){
    let ur = ""
    checkedArray.forEach(element => {
        ur=ur+"attr="+element+"&"
    });
    const res  = await fetch('/excelAttr/'+document.querySelector("#excelFiles").options[document.querySelector("#excelFiles").selectedIndex].id+'?'+ur.slice(0,-1))
    let Rdata = await res.json()
    //console.log(Rdata.data)
    
    for(let i=0; i<checkedArray.length;i++){
      let uniqueNeeded = finalObj[i].needed.filter((v, i, a) => a.indexOf(v) === i)
      finalObj[i].needed.length=0
      finalObj[i].needed = uniqueNeeded
      
      let colData =[] 
      
      colData = getFields(Rdata.data,checkedArray[i])
    
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
    let chart = $("#chartExcel" ).val()
    //let num=Date.now()
    //console.log(chart)
    if(finalObj.some(obj => obj.category == 'number')){
         dis() 
         $("#selectMetric .modeOptions").remove()
          for(let i=0;i<finalObj.length;i++){
              if(finalObj[i].category=='number'){
                  $("#modeModal").modal('show');
                  let nameL = finalObj[i].name
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

  document.querySelector("#deleteExcel").addEventListener('click', async ()=>{
    let selected = document.querySelector("#excelFiles")
      //console.log(selected.options[selected.selectedIndex])
      $('#'+selected.options[selected.selectedIndex].id).remove
      fetch('/excelDelete/'+selected.options[selected.selectedIndex].id, {
        method: 'DELETE', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.text)
      .then(dashboard => {
        console.log('Delete Success')
        //deleteCharts()
        document.querySelector('#excelAttributes').innerHTML=""
        selected.remove(selected.selectedIndex)
      })
      .catch((error) => {
        console.error('Error:', error);
      })  
  })


