let AVGCharts = (wData,wAct,wholeArray,chart,ui,title,pos) => {
    
    let uniqueAct = wAct.filter((v, i, a) => a.indexOf(v) === i)
    let uniqueData = wData.filter((v, i, a) => a.indexOf(v) === i)
    let sum = 0
    let len = 0
    let totalComp = []
    for(let i=0;i<uniqueAct.length;i++){ 
     for(let x=0;x<uniqueData.length;x++){
         for(let j=0;j<wholeArray.length;j++){
             if(uniqueAct[i]==wholeArray[j].ActivityNo && (uniqueData[x]==wholeArray[j].Time || uniqueData[x]==wholeArray[j].Gender || uniqueData[x]==wholeArray[j].EducationLevel  )){
                 sum = sum + wholeArray[j].ScoreAchieved 
                 len = len + 1       
             }
         }
         totalComp.push(new Array(sum,len,uniqueAct[i],uniqueData[x],0))
         sum = 0
         len = 0 
     }
    }

    totalComp.forEach(element => {
        if(element[0]!=0){
            let dia = element[0]/element[1]
            element[4]=dia
        }
    });
    
    let data = []
    let start = 0
    let arrayComp = []
    totalComp.forEach(element => {
        arrayComp.push(element[4].toFixed(1))
    });
    for(let i=0;i<uniqueAct.length;i++){  
        let obj = {
                    label: "Act."+uniqueAct[i],
                    backgroundColor:colors[i],
                    borderColor:'#777',
                    hoverBorderWidth:2,
                    hoverBorderColor:'#000',
                    data: arrayComp.slice(start,start+uniqueData.length)
                }
                start=start+uniqueData.length
                data.push(obj)
    }
    document.querySelector("#"+pos).insertAdjacentHTML("beforeend",`
    <canvas class="chart" draggable="false" id="${ui}" width="200px" height="200px"></canvas>`)
    chartProductionTCN(chart,ui,data,title,uniqueData)
}