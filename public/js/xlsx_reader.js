let finalObjExcel = []
let input = document.getElementById('input')
input.addEventListener('change',function(){
    readXlsxFile(input.files[0]).then(function(data){
        let attr = data[0]
        let entry = new Array()
        for(let j=1;j<data.length;j++){
            for(let i=0;i<attr.length;i++){
                entry.push(new Array(attr[i],data[j][i]))
        }
            let obj = Object.fromEntries(entry)
            finalObjExcel.push(obj)
            entry.length=0   
        }
        let final = {data:finalObjExcel,excelName:input.files[0].name}
        fetch('/excel', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(final),
          })
          .then(response => response.text)
          .then(async () => {
            console.log('Success storattion:')
            document.querySelector("#excelFiles").innerHTML=""
            document.querySelector("#excelFiles").insertAdjacentHTML("beforeend",`<option value="none" selected="">-</option>`)
            const res  = await fetch('/excelNames')
            let excels = await res.json()
            excels.forEach(element => {
              document.querySelector("#excelFiles").insertAdjacentHTML('beforeend',`<option id="${element._id}" value="${element.excelName}">${element.excelName}</option>
                `)  
            })
          })
          .catch((error) => {
            console.error('Error:', error);
          })
        
    })
})


  
