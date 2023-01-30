let studentCharts = (finalObj,checkedArray,uid) => {
    
    
}


  

/*
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

    if(finalObj.length == 2){
        let posAttr = finalObj.findIndex(obj => obj.name != 'Student')
        if(finalObj[posAttr].category == 'number'){
            $("#modeTCNModal").modal('show')
            if(finalObj[0].mode == 'maxmin'){
                dataClass.push(Math.max(...finalObj[posAttr].data))
                dataClass.push(Math.min(...finalObj[posAttr].data))
                dataStudent.push(Math.max(getFields([tcnData],checkedArray[posAttr])[0]))
                dataStudent.push(Math.min(getFields([tcnData],checkedArray[posAttr])[0]))
                
            }else if(finalObj[0].mode == 'avg') {
                let totalSum = finalObj[posAttr].data.reduce(function (accumulator, item) {
                    return accumulator + item;
                  }, 0);
                  dataStudent.push(getFields([tcnData],checkedArray[posAttr])[0])
                  dataStudent.push(totalSum/finalObj[posAttr].data.length)
            }
        }
     }else if(finalObj.length == 3){
        let posAttr = finalObj.findIndex(obj => obj.name == 'Student')
        finalObj.splice(posAttr,1)
        checkedArray.splice(posAttr,1)
        for(let i=0;i<finalObj[0].data.length;i++){
            let dataObj = { one : finalObj[0].data[i] , two : finalObj[1].data[i] }
            dataCombine.push(dataObj)
        }
        if(finalObj.find(str => str.category == 'categorical')){
            let categoricalPos = finalObj.findIndex(str => str.category == 'categorical')
            let numericalPos = finalObj.findIndex(str => str.category == 'number')
            if(finalObj[0].mode=='maxmin'){
                if(numericalPos == 0 ){
                    const mapobj = dataCombine.filter(obj => obj.two == getFields([tcnData],checkedArray[categoricalPos])[0])
                    let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                    let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                    dataClass.push(maxn)
                    dataClass.push(minn)
                    dataStudent.push(getFields([tcnData],checkedArray[numericalPos])[0])
                    dataStudent.push(getFields([tcnData],checkedArray[numericalPos])[0])
                }else{
                    const mapobj = dataCombine.filter(obj => obj.one == getFields([tcnData],checkedArray[categoricalPos])[0])
                    let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                    let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                    dataClass.push(maxn)
                    dataClass.push(minn)
                    dataStudent.push(getFields([tcnData],checkedArray[numericalPos])[0])
                    dataStudent.push(getFields([tcnData],checkedArray[numericalPos])[0]) 
                }
            }else{

            } 
        }else{

        }
     }else if(finalObj.length == 4){

     }

    console.log(dataClass)
    if(finalObj.some(str => str.mode == 'maxmin')){

        labelsTCN  = [
            {
                label: "Student",
                backgroundColor:colors[0],
                borderColor:'#777',
                hoverBorderWidth:2,
                hoverBorderColor:'#000',
                data: dataStudent
              },
              {
                label: "Class",
                backgroundColor:colors[1],
                borderColor:'#777',
                hoverBorderWidth:2,
                hoverBorderColor:'#000',
                data: dataClass
              }
        ]

        chartProductionTCN('bar',uid,labelsTCN,'ΜΑΧ/ΜΙΝ',['MAX','MIN']) 
    }else{

        labelsTCN  = [
            {
                label: "Student",
                backgroundColor:colors[0],
                borderColor:'#777',
                hoverBorderWidth:2,
                hoverBorderColor:'#000',
                data: dataStudent
              },
        ]

        chartProductionTCN('bar',uid,labelsTCN,'Average',['Student','Class'])
    }     
*/