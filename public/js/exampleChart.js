let data1 = [{x: 'Jan', net: 100, cogs: 50, gm: 50}, {x: 'Feb', net: 120, cogs: 55, gm: 75}];
    Chart.defaults.global.legend.position="bottom"; 
    var myChart = new Chart(document.getElementById("lineChart"), {
        type: 'bar',
        data: {
            labels: [['Jan ','a'], ['Feb','b']],  //data.map(o => o.x), //labels: [['Jan','a'], ['Feb','b']]
            datasets: [{
              label: 'Net sales',
              data: data1.map(o => o.net)
            }, {
              label: 'Cost of goods sold',
              data: data1.map(o => o.cogs)
            }, {
              label: 'Gross margin',
              data: data1.map(o => o.gm)
            }]
          },
        options: {
            scales: {yAxes: [{
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
            },title:{
                display: true,
                text: 'Line Chart'
            }
        }
    });
