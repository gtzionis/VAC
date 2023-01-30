$(document).ready(function(){
    $("#searchFilter").click(function(){
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
    });
  });

  document.querySelector("#modeSubmit").addEventListener("click",(e) =>{
    let mode = $('#modeSelection input:radio:checked').val()
    let metricSel = document.querySelector("#selectMetric").value
    finalObj.forEach(element => {
        element.mode = mode
        if(metricSel==element.name){
            element.metric = true
        }
    });
  })

  let dis = () => {
    if(finalObj.length==1){
        document.querySelector('#inlineRadio3').setAttribute("disabled", "")
    }else{
        document.querySelector('#inlineRadio3').removeAttribute("disabled")
    }
}
  
  