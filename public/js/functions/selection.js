//fetch the name of the dashboard to put it in the selection
//when a change occurs we fetch the dashoboard and we calculate again the nums numerical
//reFetch in the chabge of dashs do this action
let editDashboards = []

let Dashs = async () => {
    const res  = await fetch('/dashboards')
    let dashs = await res.json()
    let dashSelections = document.querySelector("#dashboards")
    dashs.forEach(element => {
      dashSelections.insertAdjacentHTML('beforeend',`<option id="${element._id}" value="${element.dashName}">${element.dashName}</option>`)  
    })
}

Dashs()


document.querySelector("#dashboards").addEventListener("change", async (e) =>{
    //console.log(e.target.value)
    if(e.target.value!='none'){
      addRemoveClass(1)
    }else{
      addRemoveClass(2)
    }
    let selected = document.querySelector("#dashboards")
    //console.log(selected.options[selected.selectedIndex].id)
    deleteCharts()
    if(selected.options[selected.selectedIndex].value!='none'){
        const res  = await fetch('/dashboards/'+selected.options[selected.selectedIndex].id)
        let dashs = await res.json()
        editDashboards = dashs.dash
        for(let i=0;i<dashs.dash.length;i++){
          for(let j=0;j<dashs.dash[i].dashObj.length;j++){
            //console.log(dashs.dash[i].dashObj[j].excel)
            if(dashs.dash[i].dashObj[j].excel=='none'){//
                  const res  = await fetch('/refugees/'+dashs.dash[i].dashObj[j].name)
                  let Rdata = await res.json()
                  //console.log(Rdata)
                  let colData = []
                  if(dashs.dash[i].dashObj[j].name.includes("Minigame")){
                  array = Rdata[0].Minigame.map(Object.values)
                    
                  Rdata.forEach(activities => {
                  activities.Minigame.forEach(element => {
                        if(dashs.dash[i].dashObj[j].name.includes("minigameID")){colData.push(element.minigameID)}
                        else if(dashs.dash[i].dashObj[j].name.includes("score")){colData.push(element.score)}
                        else if(dashs.dash[i].dashObj[j].name.includes("time")){colData.push(element.time)}
                      });
                    });
                  }else if(dashs.dash[i].dashObj[j].name.includes("Assessment")){
                    array = Rdata[0].Assessment.map(Object.values)
                    Rdata.forEach(activities => {
                    activities.Assessment.forEach(element => {
                          if(dashs.dash[i].dashObj[j].name.includes("LessonId")){colData.push(element.LessonId)}
                          else if(dashs.dash[i].dashObj[j].name.includes("AssessmentScore")){colData.push(element.AssessmentScore)}
                          else if(dashs.dash[i].dashObj[j].name.includes("ListeningScore")){colData.push(element.ListeningScore)}
                          else if(dashs.dash[i].dashObj[j].name.includes("VocabularyScore")){colData.push(element.VocabularyScore)}
                          else if(dashs.dash[i].dashObj[j].name.includes("WritingScore")){colData.push(element.WritingScore)}
                          else if(dashs.dash[i].dashObj[j].name.includes("ReadingScore")){colData.push(element.ReadingScore)}
                        });
                      });
                  }else if(dashs.dash[i].dashObj[j].name.includes("ApplicationForm")){
                    array = Rdata[0].ApplicationForm.map(Object.values)
                    Rdata.forEach(activities => {
                    activities.ApplicationForm.forEach(element => {
                          if(dashs.dash[i].dashObj[j].name.includes("scenarioID")){colData.push(element.scenarioID)}
                          else if(dashs.dash[i].dashObj[j].name.includes("stage")){colData.push(element.stage)}
                          else if(dashs.dash[i].dashObj[j].name.includes("stagescore")){colData.push(element.stagescore)}
                          else if(dashs.dash[i].dashObj[j].name.includes("stagetime")){colData.push(element.stagetime)}
                          else if(dashs.dash[i].dashObj[j].name.includes("attempts")){colData.push(element.attempts)}
                        });
                      });
                  }else{
                    let array = Rdata.map(Object.values)

                    array.forEach(element => {
                      colData.push(element[0])
                    })
                    dashs.dash[i].dashObj[j].data = colData
                  }
                  
                  //dashs.dash[i].dashObj[j].data = colData
            }
          }
        }
        for(let i=0;i<dashs.dash.length;i++){
          if(dashs.dash[i].column=='col1'){
            document.querySelector("#col1").insertAdjacentHTML('beforeend',`<canvas class="chart shadow-lg"  draggable="true" id="${dashs.dash[i].id}" width="20rem" height="22rem"></canvas>`)
            createChart(dashs.dash[i].chart,dashs.dash[i].id,dashs.dash[i].dashObj)
          }else if(dashs.dash[i].column=='col2'){
            document.querySelector("#col2").insertAdjacentHTML('beforeend',`<canvas class="chart shadow-lg"  draggable="true" id="${dashs.dash[i].id}" width="20rem" height="22rem"></canvas>`)
            createChart(dashs.dash[i].chart,dashs.dash[i].id,dashs.dash[i].dashObj)
          }else{
            document.querySelector("#col3").insertAdjacentHTML('beforeend',`<canvas class="chart shadow-lg"  draggable="true" id="${dashs.dash[i].id}" width="20rem" height="22rem"></canvas>`)
            createChart(dashs.dash[i].chart,dashs.dash[i].id,dashs.dash[i].dashObj)
          }
        }
    } 
})

