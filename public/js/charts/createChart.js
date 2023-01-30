
//The base script with structure of building a chart
//take what chart we want to create and the finalObject that created from the modalFilter
//ID we take it from the chartProduction
//also here we have the calculation function from the calculationObj for calculating the NumsNumerical
//editLegLab to edit the legends and positioning of the attribute this function is in editLL
let createChart = (chart,ID,finalObj) =>{
    editLegLab(colors,finalObj)  
  
    let obj = {}
    let labelsO = []
    let datasets=[]
    calculations(labelsO,datasets,colors,finalObj)
    //console.log(finalObj)
    //console.log(titleO)
    if(chart=='bar'){
        let myChart = new Chart(document.getElementById(ID), {
            type:chart, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:{
              labels:labelsO,
              datasets
            },
            options:{
              title:{
                display:true,
                text:titleO,
                fontSize:16
              },scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        autoSkip: false,
                        maxRotation: degr,
                        minRotation: degr
                    }
                }]
            },
              legend:{
                display:showLegend,
                position:'bottom',
                labels:{
                  fontColor:'#000'
                }
              },
              tooltips:{
                enabled:true,
                mode: 'index'
              }
            }
          });
    }else if(chart == 'horizontalBar'){
      let myChart = new Chart(document.getElementById(ID), {
        type:chart, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
          labels:labelsO,
          datasets
        },
        options:{
          title:{
            display:true,
            text:titleO,
            fontSize:16
          },scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0
                }
            }]
        },
          legend:{
            display:showLegend,
            position:'bottom',
            labels:{
              fontColor:'#000'
            }
          },
          tooltips:{
            enabled:true,
            mode: 'index'
          }
        }
      });
    }
    else if(chart == 'pie' || chart == 'doughnut'){
      let myChart = new Chart(document.getElementById(ID), {
        type:chart, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
          labels:labelsO,
          datasets
        },
        options:{
          title:{
            display:true,
            text:titleO,
            fontSize:16
          },scales: {
            yAxes: [{
                ticks: {
                  display: false
                }
            }],
            xAxes: [{
                ticks: {
                  display: false
                }
            }]
        },
          legend:{
            display: true,
                position:'bottom',
                labels:{
                  fontColor:'#000'
                }
          },
          tooltips:{
            enabled:true
          }
        }
      });
    }else{
        var myChart = new Chart(document.getElementById(ID), {
            type:chart, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:{
              labels:labelsO,
              datasets
            },
            options:{
              title:{
                display:true,
                text:titleO,
                fontSize:16
              },scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        autoSkip: false,
                        maxRotation: degr,
                        minRotation: degr
                    }
                }]
            },
              legend:{
                display: showLegend,
                    position:'bottom',
                    labels:{
                      fontColor:'#000'
                    }
              },
              tooltips:{
                enabled:true
              }
            }
          }); 
    }      
}

let chartProductionTCN = (chart,ID,data,title,labels) =>{
  
  let myChart = new Chart(document.getElementById(ID), {
    type:chart, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:{
      labels:labels,
      datasets:data
    },
    options:{
      title:{
        display:true,
        text:title,
        fontSize:16
      },scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip: false,
                //maxRotation: degr,
                //minRotation: degr
            }
        }]
    },
      legend:{
        display:true,
        position:'bottom',
        labels:{
          fontColor:'#000'
        }
      },
      tooltips:{
        enabled:true,
        mode: 'index'
      }
    }
  });
}