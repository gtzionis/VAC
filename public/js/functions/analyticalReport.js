document.querySelector("#reportBtn").addEventListener("click", async () => {
    let markup = document.documentElement.innerHTML;
    //console.log(markup);
    let allCharts = document.querySelectorAll('canvas')
    allCharts.forEach((obj,index) =>  {
        console.log(obj.id)
        let ctx = obj.getContext("2d");
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, obj.width + 1000, obj.height + 1000);
        let dataURL = obj.toDataURL()
        //console.log(dataURL)
        let image = new Image();
        image.src = dataURL
        var a = document.createElement("a"); //Create <a>
        a.href = dataURL //Image Base64 Goes here
        a.download = "Chart"+index+".png"; //File name Here
        a.click(); //Downloaded file
    });

    Office.onReady(() => {
      Excel.run(function (context) {     
          console.log('Your code goes here.');
      }).catch(function (error) {
          console.log('error: ' + error);
      });
  });

    //console.log(finalObj)
    //console.log(dashboard)
    /*console.log(editDashboards)
    let final = {HTMLDOC:markup,wordName:"paok"}
    fetch('/HTMLtoDOC', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final),
      })
      .then(response => response)
      .then(dashboard => {
        console.log('Success Exportation')  
      })
      .catch((error) => {
        console.error('Error:', error);
      })*/
})