$(document).ready(function(){
    $("#delete").click(function(){
      $("#deleteModal").modal('show');
      //console.log('open')
      let selected = document.querySelector("#dashboards")
      document.querySelector("#deletePara").innerHTML=""
      document.querySelector('#deletePara').insertAdjacentHTML("beforeend",`<p>Do you want to remove dashboard <b>${selected.options[selected.selectedIndex].value}</b></p>`)
    });
  });

  $(document).ready(function(){
    $("#deleteTrue").click(function(){
      $("#deleteModal").modal('hide')
      addRemoveClass(2)
      let selected = document.querySelector("#dashboards")
      //console.log(selected.options[selected.selectedIndex])
      $('#'+selected.options[selected.selectedIndex].id).remove
      fetch('/dashboards/'+selected.options[selected.selectedIndex].id, {
        method: 'DELETE', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(dashboard => {
        console.log('Delete Success:')
        deleteCharts()
        selected.remove(selected.selectedIndex)
        document.querySelector('#delete').classList.add('disabled')
      })
      .catch((error) => {
        console.error('Error:', error);
      })  
    });
  });