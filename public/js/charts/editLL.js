let degr = 0
let show = true
let showLegend = false

let editLegLab = (colors,finalObj) =>{
  colors.unshift('rgba(255, 99, 132, 0.3)')
  colors.unshift('rgba(54, 162, 235, 0.3)')
  colors.unshift('rgba(255, 99, 132, 0.3)')
  colors.unshift('rgba(255, 159, 64, 0.3)')
  colors.unshift('rgba(153, 102, 255, 0.3)')
  colors.unshift('rgba(75, 192, 192, 0.3)')
  colors.unshift('rgba(255, 206, 86, 0.3)')
  
  
  
  degr = 0
  show = true
  showLegend = false

  if(finalObj.length==1){
    if(finalObj[0].needed.length >= 4){
        degr = 90
        show = false
    }
    if(finalObj[0].needed.length > 7){
      for(let i=7;i<finalObj[0].needed.length;i++){
        colors.push(getRandomRgb())
      }
    }
  }else if(finalObj.length==2){
    if( finalObj[1].needed.length >= 4){
      degr = 90
      show = false
    }
    if(finalObj[1].needed.length > 7){
      for(let i=7;i<finalObj[1].needed.length;i++){
        colors.push(getRandomRgb())
      }
    }
    showLegend=true
  }else if(finalObj.length==3){
    if( finalObj[1].needed.length >= 4 || finalObj[2].needed.length>=4 ){
      degr = 90
      show = false
    }
    if(finalObj[1].needed.length > 7 || finalObj[2].needed.length>7){
      let len = 0
      if(finalObj[1].needed.length > finalObj[2].needed.length){
        len=finalObj[1].needed.length
      }else{
        len=finalObj[2].needed.length
      }
      for(let i=7;i<len;i++){
        colors.push(getRandomRgb())
      }
    }
    showLegend=true
  }
  //console.log(show,degr)
}

