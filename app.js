const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');

const covidAPI = "https://pomber.github.io/covid19/timeseries.json";

let dataACountry = {
    time : [],
    valueConfirmed : [],
    valueDeaths : [],
    valueRecover : []
};
let sellectCountry = 'Vietnam';
function drawConfirmed(){
   
    const myChart = new Chart(ctx, {
        type: 'line',        
        data: {
            labels: dataACountry.time,
            datasets: [{
                label: 'Số ca nhiễm',
                data: dataACountry.valueConfirmed,
                backgroundColor: 'rgba(242, 5, 5, .3)' ,
                borderColor: 'rgba(242, 5, 5, .8)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
function drawStatusAll(){
    const dataIll =[
        dataACountry.valueConfirmed.slice(-1)[0],
        dataACountry.valueRecover.slice(-1)[0],
        dataACountry.valueDeaths.slice(-1)[0] 

    ]
    const myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Số người nhiễm bệnh', 'số người khỏi bệnh', 'số người chết'] ,
            datasets: [{
                label: 'Tình hình bệnh nhân'  ,
                data: dataIll,
                backgroundColor: ['rgba(242, 5, 5, .9)','rgba(14, 166, 47, .9)','rgba(40, 40, 40, .9)'  ] ,
                borderColor: ['rgba(242, 5, 5, 1)','rgba(14, 166, 47, 1)','rgba(40, 40, 40, 1)'  ],
                hoverBackgroundColor:['rgba(242, 5, 5, 1)','rgba(14, 166, 47, 1)','rgba(40, 40, 40, 1)'  ],
                borderWidth: 1
            }]
        },
        
    });
}

fetch(covidAPI)
    .then(res => res.json())
    .then(data => {
        dataACountry.time = data[sellectCountry].map(item => item.date);  
        dataACountry.valueConfirmed = data[sellectCountry].map(item => item.confirmed);  
        dataACountry.valueRecover = data[sellectCountry].map(item => item.recovered);  
        dataACountry.valueDeaths = data[sellectCountry].map(item => item.deaths);  
        drawConfirmed();
        drawStatusAll();
        //console.log(dataACountry);
    });
