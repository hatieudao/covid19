const select = document.getElementById('country');
const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const table = document.getElementById('tb');
const countConfirmed = document.getElementById('tb-confirmed');
const countNewConfirmed = document.getElementById('tb-newConfirmed');
const countRecoverd = document.getElementById('tb-recovered');
const countDeaths = document.getElementById('tb-deaths');
const flagImg = document.getElementById('countryImg');

const covidAPI = "https://pomber.github.io/covid19/timeseries.json";

// data a country
let dataACountry = {
    time : [],
    valueConfirmed : [],
    valueDeaths : [],
    valueRecover : []
};

//initial
let sellectCountry = 'Vietnam';

//change 
select.addEventListener('change', ()=>{
    sellectCountry = select.value;
    console.log(sellectCountry);
    todayInf();
});

//draw line chart
const myLineChart = new Chart(ctx, {
        type: 'line',        
        data: {
            labels: dataACountry.time,
            datasets: [{
                label: 'Số ca nhiễm theo thời gian',
                data: dataACountry.valueConfirmed,
                backgroundColor: 'rgba(242, 5, 5, .3)' ,
                borderColor: 'rgba(242, 5, 5, .8)',
                pointBorderWidth: 0
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
//draw "pie" chart
const myPieChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: ['Số người còn nhiễm bệnh', 'số người khỏi bệnh', 'số người chết'] ,
        datasets: [{
            label: 'Tình hình bệnh nhân'  ,
            data: [],
            backgroundColor: ['rgba(242, 5, 5, .9)','rgba(14, 166, 47, .9)','rgba(40, 40, 40, .9)'  ] ,
            borderColor: ['rgba(242, 5, 5, 1)','rgba(14, 166, 47, 1)','rgba(40, 40, 40, 1)'  ],
            hoverBackgroundColor:['rgba(242, 5, 5, 1)','rgba(14, 166, 47, 1)','rgba(40, 40, 40, 1)'  ],
            borderWidth: 1
            }]
        },
        
});
//fetch data and render chart
let today;
let countryName;
let allData;
let flag;
function todayInf(){
    let todayAPI = `https://corona.lmao.ninja/countries/${sellectCountry}`;
    fetch(todayAPI)
        .then(res=>res.json())
        .then(data=>{
            today = {
                confirmed: data.cases,
                recovered: data.recovered,
                deaths: data.deaths
            };
            flag = data.countryInfo.flag;
            return fetch(covidAPI);
        }).then(res=>res.json()).then(data=> render(data));
}

function render(data){    
            allData = data;
            dataACountry.time = data[sellectCountry].map(item => item.date);  
            dataACountry.valueConfirmed = data[sellectCountry].map(item => item.confirmed);  
            dataACountry.valueRecover = data[sellectCountry].map(item => item.recovered);  
            dataACountry.valueDeaths = data[sellectCountry].map(item => item.deaths); 
            //update latest value
            let n = dataACountry.valueConfirmed.length;
            dataACountry.valueConfirmed[n-1] = today.confirmed;
            dataACountry.valueRecover[n-1] = today.recovered;
            dataACountry.valueDeaths[n-1] = today.deaths;
            // drawConfirmed();
            myLineChart.data.labels = dataACountry.time;
            myLineChart.data.datasets[0].data = dataACountry.valueConfirmed;
            myLineChart.update();
            // drawStatusAll();
            let patient = dataACountry.valueConfirmed.slice(-1)[0] ;
            let recovered = dataACountry.valueRecover.slice(-1)[0] ;
            let deaths = dataACountry.valueDeaths.slice(-1)[0] ;
            myPieChart.data.datasets[0].data = [ patient - recovered -deaths, recovered, deaths ];
            myPieChart.update();
            countryName = Object.keys(data);
            let stringHTML = '';
            //option country
            countryName.forEach(name => {
                if(name === sellectCountry) 
                    stringHTML = stringHTML + `<option value="${name}" selected > ${name} </option>`;
                else
                    stringHTML = stringHTML + `<option value="${name}" > ${name} </option>`;
            });
            select.innerHTML = stringHTML;
            //show number
            let ncf = patient - dataACountry.valueConfirmed.slice(-2)[0];
            countConfirmed.innerHTML = `${patient}`;
            countRecoverd.innerHTML = `${recovered}`;
            countDeaths.innerHTML = `${deaths}`;
            countNewConfirmed.innerHTML = `${ (ncf>0) ? ncf: 0 }`;
            // add flag
            flagImg.innerHTML = `Quốc Gia <img src="${flag}" alt="flag" class="flag">` ;
            //add sort
            countConfirmed.addEventListener( 'click', ()=> sortData(1) );
            countNewConfirmed.addEventListener( 'click', ()=> sortData(2) );
            countRecoverd.addEventListener( 'click', ()=> sortData(3) );
            countDeaths.addEventListener( 'click', ()=> sortData(4) );
        }
function sortData(type){
    let n = allData[sellectCountry].length;
    let res = 0;
    let resCountry =[];
    if(type === 2){
        countryName.forEach(name => {
            if ( allData[name][n-1].confirmed - allData[name][n-2].confirmed > res ){
                res = allData[name][n-1].confirmed - allData[name][n-2].confirmed;
                resCountry = [name];
            } else if(allData[name][n-1].confirmed - allData[name][n-2].confirmed === res){
                resCountry.push(name);
            }
        });
    }
    else if(type === 1){
        countryName.forEach(name => {
            if ( allData[name][n-1].confirmed > res ){
                res = allData[name][n-1].confirmed;
                resCountry = [name];
            } else if(allData[name][n-1].confirmed === res){
                resCountry.push(name);
            }
        });
    }
    else if(type === 3){
        countryName.forEach(name => {
            if ( allData[name][n-1].recovered > res ){
                res = allData[name][n-1].recovered;
                resCountry = [name];
            } else if(allData[name][n-1].recovered === res){
                resCountry.push(name);
            }
        });
    }
    else if(type === 4){
        countryName.forEach(name => {
            if ( allData[name][n-1].deaths > res ){
                res = allData[name][n-1].deaths;
                resCountry = [name];
            } else if(allData[name][n-1].deaths === res){
                resCountry.push(name);
            }
        });
    }
    if(resCountry.length === 1) {
        sellectCountry = resCountry[0];
        todayInf();
    }
    // let stringTableHTML=`<option value="${resCountry[0]}" selected > ${resCountry[0]} </option>`;
    // select.innerHTML = stringTableHTML;
    // stringTableHTML = '<tr>';
    // resCountry.forEach(country => {
    //     stringTableHTML = stringTableHTML + `<td></td>`;
    // });
}
todayInf();