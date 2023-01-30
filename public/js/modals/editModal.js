$(document).ready(function(){
    $("#edit").click(function(){
      $("#editModal").modal('show');
      document.querySelector('#edit-name-dash').value=document.querySelector("#dashboards").options[document.querySelector("#dashboards").selectedIndex].value    
    })
  })

  $(document).ready(function(){
    $("#editFalse").click(function(){
      $("#editModal").modal('hide')
        positioning(editDashboards)
        editDashboards.sort(compare)
        let selected = document.querySelector("#dashboards")
        editDashboards.forEach(element => {
            element.dashName=document.querySelector('#edit-name-dash').value
        })
        console.log(editDashboards)
        let final = {dash:editDashboards, dashName:document.querySelector('#edit-name-dash').value}
        selected.options[selected.selectedIndex].value = document.querySelector('#edit-name-dash').value
        selected.options[selected.selectedIndex].innerText = document.querySelector('#edit-name-dash').value
        fetch('/dashboards/'+selected.options[selected.selectedIndex].id, {
          method: 'PUT', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body:  JSON.stringify(final)
        })
        .then(response => response.json())
        .then(dashboard => {
          console.log('Update Success:')
          editDashboards.length=0 
        })
        .catch((error) => {
          console.error('Error:', error);
        })  
        
    });
  });

  $(document).on('dblclick','.chart',function(){
    for(let i=0;i<editDashboards.length;i++){
        if(editDashboards[i].id==this.id){
            editDashboards.splice(i,1)
        }
    }
  });
  