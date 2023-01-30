let colors = []
colors.unshift('rgba(255, 99, 132, 0.3)')
colors.unshift('rgba(255, 159, 64, 0.3)')
colors.unshift('rgba(153, 102, 255, 0.3)')
colors.unshift('rgba(75, 192, 192, 0.3)')
colors.unshift('rgba(255, 206, 86, 0.3)')
colors.unshift('rgba(54, 162, 235, 0.3)')
colors.unshift('rgba(255, 99, 132, 0.3)')

let AVG = (data) =>{
  let avg = []
  data.forEach(element => {
      let res = (element[0]/element[1]).toFixed(1)
      avg.push(res)
  })
  return avg
}

function percentage(partialValue, totalValue) {
  return ((100 * partialValue) / totalValue).toFixed(1);
} 

let compare = (a, b) => {
    if (a.position > b.position) return 1;
    if (b.position > a.position) return -1;
    return 0;
  }

let deleteCharts = () => {
    document.querySelector("#col1").innerHTML=""
    document.querySelector("#col2").innerHTML=""
    document.querySelector("#col3").innerHTML=""
}

let addRemoveClass = (num) => {
  if(num==1){
      document.querySelector('#delete').classList.remove('disabled')
      document.querySelector('#save').classList.add('disabled')
      document.querySelector('#edit').classList.remove('disabled') 
  }else if(num==2){
      document.querySelector('#delete').classList.add('disabled')
      document.querySelector('#save').classList.remove('disabled')
      document.querySelector('#edit').classList.add('disabled')
  }
}

let getRandomRgb = () => {
  var r = Math.floor(Math.random() * (255 - 0 + 1) + 0);
  var g = Math.floor(Math.random() * (255 - 0 + 1) + 0);
  var b = Math.floor(Math.random() * (255 - 0 + 1) + 0);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.3)';
}


let positioning = (dashboard) => {
  for(let i=0;i<dashboard.length;i++){
    //dashboard[i].dashName=inp
    $(`#col1 > #${dashboard[i].id} `).is(function(){
      //console.log('col1')
      dashboard[i].column='col1'
      dashboard[i].position=$(`#${dashboard[i].id}`).position().top
    })
    $(`#col2 > #${dashboard[i].id} `).is(function(){
      //console.log('col2')
      dashboard[i].column='col2'
      dashboard[i].position=$(`#${dashboard[i].id}`).position().top
    })
    $(`#col3 > #${dashboard[i].id} `).is(function(){
      //console.log('col3')
      dashboard[i].column='col3'
      dashboard[i].position=$(`#${dashboard[i].id}`).position().top
    })
  }
}

let reFetchData = async (dash) => {
    for(let i=0;i<dash.length;i++){
      for(let j=0;j<dash[i].dashObj.length;j++){
        //console.log(dash[i].dashObj[j].name)
        const res  = await fetch('/refugees/'+dash[i].dashObj[j].name)
        let Rdata = await res.json()
        let array = Rdata.map(Object.values)
        let colData = []
        //console.log(array)
        array.forEach(element => {
          colData.push(element[0])
        })
        dash[i].dashObj[j].data = colData
      }
    }
}

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; 
};

function infinite(numbersCombine){
  for(let i=0;i<numbersCombine.length;i++){
    if (numbersCombine[i] == Number.POSITIVE_INFINITY || numbersCombine[i] == Number.NEGATIVE_INFINITY){
      numbersCombine[i]=0
    }
  }
}

function notAnumber(numbersCombine){
  for(let i=0;i<numbersCombine.length;i++){
    if (isNaN(numbersCombine[i])){
      numbersCombine[i]=0
    }
  }
}

function posMetric(options,pose,finalObj){
  for (let index = 0; index < finalObj.length; index++) {
    if(finalObj[index].metric==true){
      options = 1
      pose = index
    }
  }
}

function sum(key) {
  return this.reduce((a, b) => a + (b[key] || 0), 0);
}

function getFields(input, field) {
  var output = [];
  for (var i=0; i < input.length ; ++i)
      output.push(input[i][field]);
  return output;
}

const dublicateItems = (arr, numberOfRepetitions) => 
    arr.flatMap(i => Array.from({ length: numberOfRepetitions }).fill(i));

let concatMerge = (array) =>{
  let merge = []
  array.data.forEach(element => {
      merge = merge.concat(element)
  })
  array.data=merge
}

let selectionTCN = (finalObj,id) => {
    
    disTCN()  
    $("#"+id+" .modeOptions").remove()
    $("#modeTCNModal").modal('show')
    for(let i=0;i<finalObj.length;i++){
        if(finalObj[i].category=='number'){
            let nameL = finalObj[i].name.replace("Activities.","")
            nameL = nameL.replace(/([A-Z])/g, ' $1').trim()
            document.querySelector("#"+id).insertAdjacentHTML('beforeend',
            `<option class="modeOptions" id="sel-${i}" value="${finalObj[i].name}">${nameL}</option>`
            )
        }
    }
}

let messageErrors = (message) => {
  $("#wrongChoise").modal('show')
  $('#wrongBody').append(`<p id="errorMessage">You should include a numerical attribute</p>`)
}

document.querySelector('#wrongClose').addEventListener('click', () =>{
  document.querySelector('#errorMessage').remove()
  $("#tcnModal").modal('show')
})

const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

let dis = () => {
  if(finalObj.length==1){
    document.querySelector('#inlineRadio3').setAttribute("disabled", "")
}else{
    document.querySelector('#inlineRadio3').removeAttribute("disabled")
}
}
