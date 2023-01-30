//we use the creatChart from the createChart.js to create the chart
//then from createChart we go to calculationObj for the calculations and the legend
//modalFilter(for the finalObj) => chartProduction (select chart,produce id, move to gine the functionality) append also html canvas for the chart => 
//createChart (editLL, calclations) => calculationObj for the nums
//remove a chart with dbclisk
//save every chart in the dashboardChart
let ids = ""
$(document).on('click','#createChart',function(){
    
        let attrList = ""
        let chart = $("#chart" ).val()

        if(chart!='none'){}

        //if(tcn!='none'){attrList.push(tcn)}

        let num=Date.now()
        $(document).ready(function(){
            
            ids = chart+'-'+num
           
            $("#searchCol").append(`<canvas class="chart shadow-lg"  draggable="true" id="${ids}" width="20rem" height="22rem"></canvas>`)//first we have to put the HTML and then t chart
            
            dashboardCharts(ids)//to store it if we want to create a dashboard
            createChart(chart,ids,finalObj)//to create the chart
            console.log("chartProduction ",finalObj)
            move()
        });
        setTimeout(function(){ attrList.length=0;}, 3000);
        $(".col > #text").remove
    
});

$(document).on('dblclick','.chart',function(){//with dbclick on a chart we remove whenever it is
    $("#"+this.id).remove();
    for(let i=0;i<dashboard.length;i++){
        if(dashboard[i].id==this.id){//and from the dashboard
            dashboard.splice(i,1)
        }
    }
});







    