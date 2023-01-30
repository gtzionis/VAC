//editdahboard save chart and dahboard save
let dashboard = []

let dashboardCharts = (ids) => {
    let element_dash = {id:"",
                    dashName:"",
                    chart:"",
                    dashObj:[],
                    column: "",
                    position: 0
                  }
    element_dash.id=ids//document.querySelector("#chart").value+"-"+Date.now()
    
    if(finalObj[0].excel=='none'){
      console.log('lakr')
      element_dash.chart=document.querySelector("#chart").value
    }else{
      console.log('excel')
      element_dash.chart=document.querySelector("#chartExcel").value
    }

    finalObj.forEach(element => {
      element_dash.dashObj.push(element)
    })
    editDashboards.push(element_dash)
    dashboard.push(element_dash)
    //console.log("dashboard:",dashboard)
    //console.log("Editdashboard:",editDashboards)
  }

$(document).ready(function(){
  $("#save").click(function(){
    $("#Modal").modal('show');
    //console.log('open')
  });
});

$(document).ready(function(){
  $("#saved").click(function(){
    $("#Modal").modal('hide');
    let inp = document.getElementById("name-dash").value;
    
    positioning(dashboard)
    //console.log(dashboard)
    dashboard.sort(compare)
    //console.log(dashboard)
    let final = {dash:dashboard,dashName:inp}
    //console.log(final)
        fetch('/dashboard', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final),
      })
      .then(response => response.json())
      .then(dashboard => {
        console.log('Success:')
        document.querySelector("#dashboards").insertAdjacentHTML('beforeend',`<option id="${dashboard._id}" value="${dashboard.dashName}">${dashboard.dashName}</option>`)   
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    dashboard.length=0
    
  })
})