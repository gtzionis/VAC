  document.querySelector("#modeTCNSubmit").addEventListener("click",(e) =>{
    let mode = $('#modeTCNSelection input:radio:checked').val()
    let metricSel = document.querySelector("#selectTCNMetric").value
    finalObj.forEach(element => {
        element.mode = mode
        if(metricSel==element.name){
            element.metric = true
        }
    });
    $("#tcnModal").modal('show')
    let chart = $("#chart" ).val()
    let ids = chart+'-'+Date.now()
    $("#sc"+columnTCN).append(`<canvas class="chart shadow-lg"  draggable="true" id="${ids}" width="20rem" height="22rem"></canvas>`)
    columnTCN++
    if(columnTCN==4){columnTCN=1}
    createChart(chart,ids,finalObj)
  })

  let disTCN = () => {
      if(finalObj.length==1){
        document.querySelector('#inlineRadio3TCN').setAttribute("disabled", "")
    }else{
        document.querySelector('#inlineRadio3TCN').removeAttribute("disabled")
    }
}
  