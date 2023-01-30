//calculations about the chart
//see how manh attributes we have and proceed with calculations
//max number of attributes in a chart 4
let titleO = ""

let calculations = (labelsO,datasets,colors,finalObj) =>{
  titleO = ""
  if(finalObj.length==1){
      finalObj[0].needed.forEach(element => {
          labelsO.push(element)
      })
      //console.log(finalObj) //check the type of the attribute and calculate the results by using the the data field and the needed field
      let num = 0
          if(finalObj[0].category=="categorical"){
            for(let j=0;j<finalObj[0].needed.length;j++){
              for(let x=0;x<finalObj[0].data.length;x++){
                if(finalObj[0].needed[j]==finalObj[0].data[x]){
                  num=num+1
                }
              }
              finalObj[0].nums[j]=num
              num=0
            }
          }else if(finalObj[0].category=="number" && finalObj[0].mode=="maxmin"){
            let maxn = Math.max(...finalObj[0].data)
            let minn = Math.min(...finalObj[0].data)
            labelsO.length = 0
            labelsO.push('MAX')
            labelsO.push('MIN')
            degr = 0
            finalObj[0].nums[0]=maxn
            finalObj[0].nums[1]=minn
          }else{
            for(let j=0;j<finalObj[0].needed.length;j++){
              for(let x=0;x<finalObj[0].data.length;x++){
                if(finalObj[0].numsNumerical[j][0] < finalObj[0].data[x] && finalObj[0].numsNumerical[j][1] >= finalObj[0].data[x]){
                  num=num+1
                }
              }
              finalObj[0].nums[j]=num
              num=0
            }
          }
          
          //put the label of the cart the data and the colors
          let obj = { label:finalObj[0].name.replace(/([A-Z])/g, ' $1').trim(),
                      data:finalObj[0].nums,
                      backgroundColor:colors,
                      borderColor:'#777',
                      hoverBorderWidth:2,
                      hoverBorderColor:'#000' 
                    }
      //find the capitals and put a space between
      if(finalObj[0].excel=='none'){
        titleO = finalObj[0].name.replace(/([A-Z])/g, ' $1').trim()
      }else{
        titleO = "Excel "+finalObj[0].name.replace(/([A-Z])/g, ' $1').trim()
      }              
      
      //
      datasets.push(obj)    
    }else if(finalObj.length==2){//-----------------------------------------------------
      finalObj.forEach(element => {
        titleO = titleO + " / "+element.name.replace(/([A-Z])/g, ' $1').trim()
      });
      titleO = titleO.substring(3)

      if(finalObj[0].excel=='none'){
        
      }else{
        titleO = "Excel "+titleO
      }  

      let dataCombine = []
      let numbersCombine = []
      let numsCombine = 0
      finalObj[1].needed.forEach(element => {
          labelsO.push(element)
      })
      //data combine we put the data of the two attributes to find the correlations beetwen them
      for(let i=0;i<finalObj[0].data.length;i++){
        let dataObj = { one : finalObj[0].data[i] , two : finalObj[1].data[i] }
        dataCombine.push(dataObj)
      }
      // we find the correlations nums
            if(finalObj[0].category=='categorical' && finalObj[1].category=='categorical'){
              for(let i=0;i<finalObj[0].needed.length;i++){
                for(let j=0;j<finalObj[1].needed.length;j++){
                  for(let x=0;x<dataCombine.length;x++){
                    if(finalObj[0].needed[i] == dataCombine[x].one && finalObj[1].needed[j] == dataCombine[x].two){
                      numsCombine=numsCombine+1
                    }
                  }
                numbersCombine.push(numsCombine)
                numsCombine=0;
                }
              }
            }else if(finalObj[0].category=='number' && finalObj[1].category=='categorical' ){//if categorical = needed ! if numerical = numsNumerical
                if(finalObj[0].mode=='maxmin'){
                  for(let i=0;i<finalObj[1].needed.length;i++){
                    const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] )
                    let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                    let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                    numbersCombine.push(maxn)
                    numbersCombine.push(minn)
                  }
                  labelsO.length = 0
                  labelsO.push('MAX')
                  labelsO.push('MIN')
                  degr = 0
                  if(finalObj[0].transition==false){
                    moveArrayItemToNewIndex(finalObj, 0, 1)
                    finalObj[0].transition=true
                  }  
                }else if(finalObj[0].mode=='avg'){
                  for(let i=0;i<finalObj[1].needed.length;i++){
                    const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] )
                    let totalSum = mapobj.reduce(function (accumulator, item) {
                      return accumulator + item.one;
                    }, 0);
                    numbersCombine.push(totalSum/mapobj.length)
                  }
                  showLegend=false
                }else{
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let x=0;x<dataCombine.length;x++){
                          if((finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one) && finalObj[1].needed[j] == dataCombine[x].two  ){
                            numsCombine=numsCombine+1
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                    }
                }
              }
            }else if(finalObj[0].category=='categorical' && finalObj[1].category=='number'){
              if(finalObj[1].mode=='maxmin'){
                for(let i=0;i<finalObj[0].needed.length;i++){
                  const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] )
                  let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                  let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                  numbersCombine.push(maxn)
                  numbersCombine.push(minn)
                }
                labelsO.length = 0
                labelsO.push('MAX')
                labelsO.push('MIN')
                degr = 0
              }else if(finalObj[0].mode=='avg'){
                labelsO.length = 0
                for(let i=0;i<finalObj[0].needed.length;i++){
                  labelsO.push(finalObj[0].needed[i])
                  const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] )
                  let totalSum = mapobj.reduce(function (accumulator, item) {
                    return accumulator + item.two;
                  }, 0);
                  numbersCombine.push(totalSum/mapobj.length)
                }
                degr=0
                showLegend=false
              }else{
                for(let i=0;i<finalObj[0].needed.length;i++){
                  for(let j=0;j<finalObj[1].needed.length;j++){
                    for(let x=0;x<dataCombine.length;x++){
                      if(finalObj[0].needed[i] == dataCombine[x].one && finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two ){
                        numsCombine=numsCombine+1
                      }
                    }
                    numbersCombine.push(numsCombine)
                    numsCombine=0;
                  }
                } 
              }
            }else{
              let options = 0
              let pose = 0
              for (let index = 0; index < finalObj.length; index++) {
                if(finalObj[index].metric==true){
                  options = 1
                  pose = index
                }
              }
              if(options==0){
                for(let i=0;i<finalObj[0].needed.length;i++){
                  for(let j=0;j<finalObj[1].needed.length;j++){
                    for(let x=0;x<dataCombine.length;x++){
                      if(finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one && 
                        finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two ){
                        numsCombine=numsCombine+1
                        }
                      }
                    numbersCombine.push(numsCombine)
                    numsCombine=0;
                  }
                }  
              }else{
                if(finalObj[0].mode=="maxmin"){
                  if(pose == 0){
                    for(let i=0;i<finalObj[1].needed.length;i++){
                      const mapobj = dataCombine.filter(obj => (obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1]))
                      let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                      let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                      numbersCombine.push(maxn)
                      numbersCombine.push(minn)
                    }
                    if(finalObj[0].transition==false){
                      moveArrayItemToNewIndex(finalObj, 0, 1)
                      finalObj[0].transition=true
                    }   
                  }else{
                    for(let i=0;i<finalObj[0].needed.length;i++){
                      const mapobj = dataCombine.filter(obj => (obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1]))
                      let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                      let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                      numbersCombine.push(maxn)
                      numbersCombine.push(minn)
                    }
                  }
                  labelsO.length = 0
                  labelsO.push('MAX')
                  labelsO.push('MIN')
                  degr = 0
                }else if(finalObj[0].mode=="avg"){
                  if(pose==0){
                    for(let i=0;i<finalObj[1].needed.length;i++){
                      const mapobj = dataCombine.filter(obj => obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] )
                      let totalSum = mapobj.reduce(function (accumulator, item) {
                        return accumulator + item.one;
                      }, 0);
                      numbersCombine.push(totalSum/mapobj.length)
                    }
                    if(finalObj[0].transition==false){
                      moveArrayItemToNewIndex(finalObj, 0, 1)
                      finalObj[0].transition=true
                    }  
                  }else{
                    labelsO.length = 0
                    for(let i=0;i<finalObj[0].needed.length;i++){
                      labelsO.push(finalObj[0].needed[i])
                      const mapobj = dataCombine.filter(obj => obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] )
                      let totalSum = mapobj.reduce(function (accumulator, item) {
                        return accumulator + item.two;
                      }, 0);
                      numbersCombine.push(totalSum/mapobj.length)
                    }
                  }
                degr=0
                showLegend=false
                }   
              }
            }
      infinite(numbersCombine)
      notAnumber(numbersCombine)         
      //console.log(numbersCombine)
      
      if(finalObj[0].mode=='avg'){
            let obj = { label:finalObj[0].name.replace(/([A-Z])/g, ' $1').trim(),
            data:numbersCombine,
            backgroundColor:colors,
            borderColor:'#777',
            hoverBorderWidth:2,
            hoverBorderColor:'#000' 
          }
          datasets.push(obj)
      }else{
        let start = 0
        for(let i=0;i<finalObj[0].needed.length;i++){
            let obj = { label:finalObj[0].needed[i].replace(/([A-Z])/g, ' $1').trim(),
                        data:numbersCombine.slice(start,labelsO.length+start),
                        backgroundColor:colors[i],
                        borderColor:'#777',
                        hoverBorderWidth:2,
                        hoverBorderColor:'#000' }
          start=start+labelsO.length
          datasets.push(obj)
        }
      }
      
    }else if(finalObj.length==3){//-----------------------------------------
      finalObj.forEach(element => {
        titleO = titleO + " / "+element.name.replace(/([A-Z])/g, ' $1').trim()
      });
      titleO = titleO.substring(3)

      if(finalObj[0].excel=='none'){
        
      }else{
        titleO = "Excel "+titleO
      } 

      let dataCombine = []
      let numbersCombine = []
      let numsCombine = 0
     
      for(let i=0;i<finalObj[1].needed.length;i++){
        for(let j=0;j<finalObj[2].needed.length;j++){
          labelsO.push(new Array(finalObj[1].needed[i],finalObj[2].needed[j]))
        }
      }

      for(let i=0;i<finalObj[0].data.length;i++){
        let dataObj = { one : finalObj[0].data[i] , two : finalObj[1].data[i] , three : finalObj[2].data[i] }
        dataCombine.push(dataObj)
      }
              if(finalObj[0].category=='categorical' && finalObj[1].category=='categorical' && finalObj[2].category=='categorical'){
                for(let i=0;i<finalObj[0].needed.length;i++){
                  for(let j=0;j<finalObj[1].needed.length;j++){
                    for(let y=0;y<finalObj[2].needed.length;y++){
                      for(let x=0;x<dataCombine.length;x++){
                        if(finalObj[0].needed[i]==dataCombine[x].one && finalObj[1].needed[j] == dataCombine[x].two && finalObj[2].needed[y] == dataCombine[x].three){
                          numsCombine=numsCombine+1
                        }
                      }
                      numbersCombine.push(numsCombine)
                      numsCombine=0;
                    }
                  }
                }
              }else if(finalObj[0].category=='categorical' && finalObj[1].category=='categorical' && finalObj[2].category=='number'){
                if(finalObj[2].mode=="maxmin"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && obj.two == finalObj[1].needed[j] )
                      let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.three; }))
                      let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.three; }))
                      numbersCombine.push(maxn)
                      numbersCombine.push(minn)
                    }
                  }
                  for(let j=0;j<finalObj[1].needed.length;j++){
                    labelsO.push(new Array(finalObj[1].needed[j],'MAX'))
                      labelsO.push(new Array(finalObj[1].needed[j],'MIN'))
                  }
                }else if(finalObj[2].mode=="avg"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && obj.two == finalObj[1].needed[j] )
                      let totalSum = mapobj.reduce(function (accumulator, item) {
                        return accumulator + item.three;
                      }, 0);
                      numbersCombine.push(totalSum/mapobj.length)
                    }
                  }
                  for(let j=0;j<finalObj[1].needed.length;j++){
                    labelsO.push(finalObj[1].needed[j])
                  }
                }else{
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].needed[i]==dataCombine[x].one && 
                            finalObj[1].needed[j] == dataCombine[x].two &&
                            finalObj[2].numsNumerical[y][0] < dataCombine[x].three && finalObj[2].numsNumerical[y][1] >= dataCombine[x].three){
                              numsCombine=numsCombine+1
                            }
                          }
                          numbersCombine.push(numsCombine)
                          numsCombine=0;
                        }
                      }
                  }
                }
              }else if(finalObj[0].category=='categorical' && finalObj[1].category=='number' && finalObj[2].category=='categorical'){
                if(finalObj[1].mode=="maxmin"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[2].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && obj.three == finalObj[2].needed[j] )
                      let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                      let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                      numbersCombine.push(maxn)
                      numbersCombine.push(minn)
                    }
                  }
                  for(let j=0;j<finalObj[2].needed.length;j++){
                    labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                      labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                  }
                }
                else if(finalObj[2].mode=="avg"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[2].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && obj.three == finalObj[2].needed[j] )
                      let totalSum = mapobj.reduce(function (accumulator, item) {
                        return accumulator + item.two;
                      }, 0);
                      numbersCombine.push(totalSum/mapobj.length)
                    }
                  }
                  for(let j=0;j<finalObj[2].needed.length;j++){
                    labelsO.push(finalObj[2].needed[j])
                  }
                }else{
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].needed[i]==dataCombine[x].one &&
                            finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two && 
                            finalObj[2].needed[y] == dataCombine[x].three){
                              numsCombine=numsCombine+1
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                      }
                    }
                  }
                }  
              }else if(finalObj[0].category=='number' && finalObj[1].category=='categorical' && finalObj[2].category=='categorical'){
                if(finalObj[2].mode=="maxmin"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[1].needed.length;i++){
                    for(let j=0;j<finalObj[2].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] && obj.three == finalObj[2].needed[j] )
                      let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                      let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                      numbersCombine.push(maxn)
                      numbersCombine.push(minn)
                    }
                  }
                  for(let j=0;j<finalObj[2].needed.length;j++){
                    labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                      labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                  }
                  if(finalObj[0].transition==false){
                    moveArrayItemToNewIndex(finalObj, 0, 1)
                    finalObj[0].transition=true
                  }
                  degr = 0
                }else if(finalObj[2].mode=="avg"){
                  labelsO.length = 0
                  for(let i=0;i<finalObj[1].needed.length;i++){
                    for(let j=0;j<finalObj[2].needed.length;j++){
                      const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] && obj.three == finalObj[2].needed[j] )
                      let totalSum = mapobj.reduce(function (accumulator, item) {
                        return accumulator + item.one;
                      }, 0);
                      numbersCombine.push(totalSum/mapobj.length)
                    }
                  }
                  for(let j=0;j<finalObj[2].needed.length;j++){
                    labelsO.push(finalObj[2].needed[j])
                  }
                  if(finalObj[0].transition==false){
                    moveArrayItemToNewIndex(finalObj, 0, 1)
                    finalObj[0].transition=true
                  }  
                }else{
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one &&
                            finalObj[1].needed[j] == dataCombine[x].two && 
                            finalObj[2].needed[y] == dataCombine[x].three){
                              numsCombine=numsCombine+1 
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                      }
                    }
                  }
                }
              }else if(finalObj[0].category=='categorical' && finalObj[1].category=='number' && finalObj[2].category=='number'){
                let options = 0
                let pose = 0
                for (let index = 0; index < finalObj.length; index++) {
                  if(finalObj[index].metric==true){
                    options = 1
                    pose = index
                  }
                }
                
                if(options==0){
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].needed[i]==dataCombine[x].one &&
                            finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two &&
                            finalObj[2].numsNumerical[y][0] < dataCombine[x].three && finalObj[2].numsNumerical[y][1] >= dataCombine[x].three){
                              numsCombine=numsCombine+1
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                      }
                    }
                  }
                }else{
                  if(finalObj[0].mode=="maxmin"){
                    if(pose == 1){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && 
                            obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1]   )
                          let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                          let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                          numbersCombine.push(maxn)
                          numbersCombine.push(minn)
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                          labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                      }
                      degr = 0
                    }else if(pose == 2){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[1].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && 
                            obj.two > finalObj[1].numsNumerical[j][0] && obj.two <= finalObj[1].numsNumerical[j][1]   )
                          let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.three; }))
                          let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.three; }))
                          numbersCombine.push(maxn)
                          numbersCombine.push(minn)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(new Array(finalObj[1].needed[j],'MAX'))
                          labelsO.push(new Array(finalObj[1].needed[j],'MIN'))
                      }
                    }
                    degr = 0
                  }else if(finalObj[0].mode=='avg'){
                    if(pose==1){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && 
                            obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.two;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(finalObj[2].needed[j])
                      }
                    }else if(pose==2){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[1].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.one == finalObj[0].needed[i] && 
                            obj.two > finalObj[1].numsNumerical[j][0] && obj.two <= finalObj[1].numsNumerical[j][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.three;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(finalObj[1].needed[j])
                      }
                    }
                  }
                }
              }else if(finalObj[0].category=='number' && finalObj[1].category=='categorical' && finalObj[2].category=='number'){
                let options = 0
                let pose = 0
                for (let index = 0; index < finalObj.length; index++) {
                  if(finalObj[index].metric==true){
                    options = 1
                    pose = index
                  }
                }
                if(options==0){
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one && 
                            finalObj[1].needed[j] == dataCombine[x].two &&
                            finalObj[2].numsNumerical[y][0] < dataCombine[x].three && finalObj[2].numsNumerical[y][1] >= dataCombine[x].three){
                              numsCombine=numsCombine+1
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                      }
                    }
                  }
                }else{
                  if(finalObj[0].mode=="maxmin"){
                    if(pose == 0){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[1].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] && 
                            obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1]   )
                          let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                          let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                          numbersCombine.push(maxn)
                          numbersCombine.push(minn)
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                          labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                      }
                      if(finalObj[0].transition==false){
                        moveArrayItemToNewIndex(finalObj, 0, 1)
                        finalObj[0].transition=true
                      }
                      degr = 0
                    }else if(pose == 2){
                      labelsO.length = 0
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[j] && 
                            obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1]   )
                          let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.three; }))
                          let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.three; }))
                          numbersCombine.push(maxn)
                          numbersCombine.push(minn)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(new Array(finalObj[1].needed[j],'MAX'))
                          labelsO.push(new Array(finalObj[1].needed[j],'MIN'))
                      }
                      degr = 0
                    }
                  }else if(finalObj[0].mode == "avg"){
                    if(pose == 0){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[1].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] && 
                              obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1] )
                            let totalSum = mapobj.reduce(function (accumulator, item) {
                              return accumulator + item.one;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(finalObj[2].needed[j])
                      }
                      if(finalObj[0].transition==false){
                        moveArrayItemToNewIndex(finalObj, 0, 1)
                        finalObj[0].transition=true
                      }
                    }else if(pose==2){
                      labelsO.length = 0
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          const mapobj = dataCombine.filter(obj => obj.two == finalObj[1].needed[i] && 
                            obj.one > finalObj[0].numsNumerical[j][0] && obj.one <= finalObj[0].numsNumerical[j][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.three;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(finalObj[1].needed[j])
                      }
                    }
                  }
                }
              }else if(finalObj[0].category=='number' && finalObj[1].category=='number' && finalObj[2].category=='categorical'){
                let options = 0
                let pose = 0
                for (let index = 0; index < finalObj.length; index++) {
                  if(finalObj[index].metric==true){
                    options = 1
                    pose = index
                  }
                }
                if(options==0){
                  for(let i=0;i<finalObj[0].needed.length;i++){
                    for(let j=0;j<finalObj[1].needed.length;j++){
                      for(let y=0;y<finalObj[2].needed.length;y++){
                        for(let x=0;x<dataCombine.length;x++){
                          if(finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one && 
                            finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two && 
                            finalObj[2].needed[y] == dataCombine[x].three){
                              numsCombine=numsCombine+1
                            }
                          }
                          numbersCombine.push(numsCombine)
                          numsCombine=0;
                        }
                      }  
                  }
                }else{
                  if(finalObj[0].mode=="maxmin"){
                    if(pose==0){
                        labelsO.length = 0
                        for(let i=0;i<finalObj[1].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] &&
                              obj.three == finalObj[2].needed[j]   )
                            let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                            let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                            numbersCombine.push(maxn)
                            numbersCombine.push(minn)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                            labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                        }
                        if(finalObj[0].transition==false){
                          moveArrayItemToNewIndex(finalObj, 0, 1)
                          finalObj[0].transition=true
                        }
                        degr = 0
                      }else if(pose==1){
                        labelsO.length = 0
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] &&
                              obj.three == finalObj[2].needed[j]   )
                            let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                            let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                            numbersCombine.push(maxn)
                            numbersCombine.push(minn)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                            labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                        }
                        degr = 0
                      }
                    }else if(finalObj[0].mode=='avg'){
                      if(pose == 0){
                        labelsO.length = 0
                        for(let i=0;i<finalObj[1].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.three == finalObj[2].needed[j] && 
                              obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] )
                            let totalSum = mapobj.reduce(function (accumulator, item) {
                              return accumulator + item.one;
                            }, 0);
                            numbersCombine.push(totalSum/mapobj.length)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(finalObj[2].needed[j])
                        }
                        if(finalObj[0].transition==false){
                          moveArrayItemToNewIndex(finalObj, 0, 1)
                          finalObj[0].transition=true
                        }
                      }else if(pose == 1){
                        labelsO.length = 0
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.three == finalObj[2].needed[j] && 
                              obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] )
                            let totalSum = mapobj.reduce(function (accumulator, item) {
                              return accumulator + item.two;
                            }, 0);
                            numbersCombine.push(totalSum/mapobj.length)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(finalObj[2].needed[j])
                        }
                      }
                    }
                  }
                  
              }else if(finalObj[0].category=='number' && finalObj[1].category=='number' && finalObj[2].category=='number'){
                let options = 0
                let pose = 0
                for (let index = 0; index < finalObj.length; index++) {
                  if(finalObj[index].metric==true){
                    options = 1
                    pose = index
                  }
                }
                if(options==0){
                    for(let i=0;i<finalObj[0].needed.length;i++){
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        for(let y=0;y<finalObj[2].needed.length;y++){
                          for(let x=0;x<dataCombine.length;x++){
                            if(finalObj[0].numsNumerical[i][0] < dataCombine[x].one && finalObj[0].numsNumerical[i][1] >= dataCombine[x].one && 
                              finalObj[1].numsNumerical[j][0] < dataCombine[x].two && finalObj[1].numsNumerical[j][1] >= dataCombine[x].two && 
                              finalObj[2].numsNumerical[y][0] < dataCombine[x].three && finalObj[2].numsNumerical[y][1] >= dataCombine[x].three){
                                numsCombine=numsCombine+1
                          }
                        }
                        numbersCombine.push(numsCombine)
                        numsCombine=0;
                      }
                    }
                  }
                }else{
                  if(finalObj[0].mode=="maxmin"){
                    if(pose==0){
                        labelsO.length = 0
                        for(let i=0;i<finalObj[1].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] &&
                             obj.three > finalObj[2].numsNumerical[j][0]  && obj.three <= finalObj[2].numsNumerical[j][1]  )
                            let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.one; }))
                            let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.one; }))
                            numbersCombine.push(maxn)
                            numbersCombine.push(minn)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                            labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                        }
                        if(finalObj[0].transition==false){
                          moveArrayItemToNewIndex(finalObj, 0, 1)
                          finalObj[0].transition=true
                        }
                        degr = 0
                    }else if(pose==1){
                      labelsO.length = 0
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          for(let j=0;j<finalObj[2].needed.length;j++){
                            const mapobj = dataCombine.filter(obj => obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] &&
                            obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1]  )
                            let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.two; }))
                            let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.two; }))
                            numbersCombine.push(maxn)
                            numbersCombine.push(minn)
                          }
                        }
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          labelsO.push(new Array(finalObj[2].needed[j],'MAX'))
                            labelsO.push(new Array(finalObj[2].needed[j],'MIN'))
                        }
                        degr = 0
                    }else if(pose==2){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[1].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] &&
                          obj.two > finalObj[1].numsNumerical[j][0] && obj.two <= finalObj[1].numsNumerical[j][1]  )
                          let maxn = Math.max.apply(Math, mapobj.map(function(o) { return o.three; }))
                          let minn = Math.min.apply(Math, mapobj.map(function(o) { return o.three; }))
                          numbersCombine.push(maxn)
                          numbersCombine.push(minn)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(new Array(finalObj[1].needed[j],'MAX'))
                          labelsO.push(new Array(finalObj[1].needed[j],'MIN'))
                      }
                      degr = 0
                    }
                  }else if(finalObj[0].mode=='avg'){
                    if(pose==0){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[1].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1] && 
                            obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.one;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(finalObj[2].needed[j])
                      }
                      if(finalObj[0].transition==false){
                        moveArrayItemToNewIndex(finalObj, 0, 1)
                        finalObj[0].transition=true
                      }
                    }else if(pose==1){
                      labelsO.length = 0
                      for(let i=0;i<finalObj[0].needed.length;i++){
                        for(let j=0;j<finalObj[2].needed.length;j++){
                          const mapobj = dataCombine.filter(obj => obj.three > finalObj[2].numsNumerical[j][0] && obj.three <= finalObj[2].numsNumerical[j][1] && 
                            obj.one > finalObj[0].numsNumerical[i][0] && obj.one <= finalObj[0].numsNumerical[i][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.two;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                          
                        }
                      }
                      for(let j=0;j<finalObj[2].needed.length;j++){
                        labelsO.push(finalObj[2].needed[j])
                      }
                    }else if(pose==2){
                      labelsO.length = 0
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        for(let i=0;i<finalObj[0].needed.length;i++){
                          const mapobj = dataCombine.filter(obj => obj.two > finalObj[1].numsNumerical[i][0] && obj.two <= finalObj[1].numsNumerical[i][1] && 
                            obj.one > finalObj[0].numsNumerical[j][0] && obj.one <= finalObj[0].numsNumerical[j][1] )
                          let totalSum = mapobj.reduce(function (accumulator, item) {
                            return accumulator + item.three;
                          }, 0);
                          numbersCombine.push(totalSum/mapobj.length)
                        }
                      }
                      for(let j=0;j<finalObj[1].needed.length;j++){
                        labelsO.push(finalObj[1].needed[j])
                      }
                    }
                  }
                }
                
            }
      infinite(numbersCombine)    
      notAnumber(numbersCombine)
          let start = 0
          for(let i=0;i<finalObj[0].needed.length;i++){
              let obj = { label:finalObj[0].needed[i].replace(/([A-Z])/g, ' $1').trim(),
                          data:numbersCombine.slice(start,labelsO.length+start),
                          backgroundColor:colors[i],
                          borderColor:'#777',
                          hoverBorderWidth:2,
                          hoverBorderColor:'#000' }
            //console.log(numbersCombine.slice(start,finalObj[1].needed.length+start))
            start=start+labelsO.length
            datasets.push(obj)
          }
        
      }
    //console.log(finalObj)
  }


  