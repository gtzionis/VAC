let classTCN = []

let TCNS = async () => {
  const res  = await fetch('/refugees/Classroom')//take all the classes
  let data = await res.json()
  let classes = []
  data.forEach(element => {
      classes.push(element.Classroom)
  });
  let uniqueData = classes.filter((v, i, a) => a.indexOf(v) === i)
  let dashSelections = document.querySelector("#classrooms")
  uniqueData.forEach(element => {
    dashSelections.insertAdjacentHTML('beforeend',`<option value="${element}">${element}</option>`)  
  })
}

TCNS()

$(document).ready(function(){
    $("#createClass").click(async function(){
      document.querySelector('#classPara').innerHTML = ""
      $("#classroomModal").modal('show');
      const agentAll = await fetch('/tcnClass')
      let agentAllData = await agentAll.json()
      let uniqueClass = agentAllData.map(obj => obj.Classroom).filter((v, i, a) => a.indexOf(v) === i)

      uniqueClass.forEach(element => {
        document.querySelector('#classPara').insertAdjacentHTML("beforeend",`
        <span class="badge badge-secondary" style="font-size:0.9rem;">${element}</span>
        <div class="check-col-3" id="${element}">

        </div>
      `)
      
      });

      uniqueClass.forEach(element => {
        agentAllData.filter(obj=>obj.Classroom ==element).forEach(tcn => {
          document.querySelector('#'+element).insertAdjacentHTML("beforeend",`
          <div><label><input type="checkbox" id="${tcn.UserId}" value="${tcn.UserId}">
          ${tcn.Name}</label></div>
          `)
        });
        
      });
      
      $("#classPara input:checkbox").change(async function() {  
        if(this.checked == true){
          classTCN.push(this.value)
        }else{
          classTCN.splice(classTCN.findIndex(obj => obj == this.value),1)
        }
      })
      
      document.querySelector('#classPara').insertAdjacentHTML("beforeend", ` 
        <div class="check-col-1">
          <input type="text" class="form-control" id="inputPassword" placeholder="Name of the Classroom">
        </div>
      `)
    });

  });

document.querySelector('#classroomBtn').addEventListener('click', async () =>{
      let final = {Classroom:document.querySelector('#inputPassword').value,classTCN:classTCN}
      $("#classrooms").empty();
      $("#classroomModal").modal('hide');
      fetch('/tcnClass', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final),
      })
      .then(response => {
        response.json()
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      const Timeout = setTimeout(TCNS, 1500)
})  
  
 