import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

get(child(ref(db),`Users/${localStorage.getItem("USER")}`)).then((user)=>{
    if(user.val().canView != true){
        alert("No tiene permisos para visualizar")
        location.href = "menu.html"
    }
})

window.productIndexes = {}

window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.salesRef = ref(db,'Sales/');

let fromDateVal = document.getElementById('from-date')
let toDateVal = document.getElementById('to-date')
let salesTotalDisp = document.getElementById('sales-total')
let salesTotalCashDisp = document.getElementById('sales-total-cash')
let salesTotalCardDisp = document.getElementById('sales-total-card')
let totalSelector = document.getElementById('total-selector')
let cashSelector = document.getElementById('cash-selector')
let cardSelector = document.getElementById('card-selector')
let dailyAverage = document.getElementById('daily-average')
let monthlyEstimate = document.getElementById('monthly-estimate')

let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")

//Changing the value in the DOM divs
fromDateVal.value = date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today
toDateVal.value =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today

get(child(ref(getDatabase()), `Products/`)).then((Products) => {

    Products.forEach((Product) => {
        productIndexes[Product.key] = Product.val().index
    })

    onValue(salesRef,(snapshot)=>{
        renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    })
    
})


totalSelector.addEventListener('click',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})
cashSelector.addEventListener('click',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""),'cash')
})
cardSelector.addEventListener('click',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""),'card')
})


let salesList = document.getElementById('sales-list')
var datatoload = []

document.getElementById('search').addEventListener('click',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    drawChart()
})

function renderSales(fromDate,toDate,method){

    let lastUpdate = String(new Date()).substring(0,25)
    document.getElementById('last-update').innerHTML = lastUpdate
    console.log("Rendering sales from",fromDate.replace(/-/g,""),"to",toDate.replace(/-/g,"")) //SERIALIZE DATE TO LATER COMPARE GREATER AND LESS THAN
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))
  
    let monthsEvaluated = Number(toDate.replace(/-/g,"").substring(0,6)) - Number(fromDate.replace(/-/g,"").substring(0,6)) + 1
    let days = Number(String(toDateSerial).substring(6,8)) - Number(String(fromDateSerial).substring(6,8))+1 + (monthsEvaluated-1)*30

    get(child(ref(db),'Cortes/')).then((cortes) => {

        let salesTotal = 0;
        let salesMat = 0;
        let salesVesp = {}
        let salesTotalCash = 0;
        let salesTotalCard = 0;
        let totalSum = 0;
        let cashSum = 0;
        let cardSum = 0;
        let Totals = [];

        salesTotalDisp.innerHTML = "$ "+ 0
        salesTotalCashDisp.innerHTML = "$ "+ 0
        salesTotalCardDisp.innerHTML = "$ "+ 0


        
        datatoload = []
        salesList.innerHTML = ""

        console.log("Done pulling from db")

        cortes.forEach(
        function(year){

            year.forEach(
                function(month){

                    month.forEach(
                        function(day){
                            

                            try{

                                salesMat = day.val().Mat
                                salesVesp = day.val().Vesp

                                salesTotal = salesMat.Total + salesVesp.Total
                                salesTotalCash = salesMat.Efectivo + salesVesp.Efectivo
                                salesTotalCard = salesMat.Tarjeta + salesVesp.Tarjeta

                                salesList.innerHTML += `
                                <li class="sale-item-li">
                                    <div class="sale-item-div" style="">
                                        <div style="width: 30%; text-align: left;">${month.key+"/"+day.key}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${salesTotal}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${salesMat.Total}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${salesVesp.Total}</div>
                                    <div>
                                </li>`

                            }catch(e){

                                salesMat = day.val().Mat

                                salesTotal = salesMat.Total 
                                salesTotalCash = salesMat.Efectivo 
                                salesTotalCard = salesMat.Tarjeta 

                                salesList.innerHTML += `
                                <li class="sale-item-li">
                                    <div class="sale-item-div" style="">
                                        <div style="width: 30%; text-align: left;">${month.key+"/"+day.key}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${salesTotal}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${0}</div>
                                        <div style="width: 5%"; text-align: right>$</div>
                                        <div style="width: 15%"; text-align: left>${salesMat.Total}</div>
                                    <div>
                                </li>
                                `
                            }

                 
 
                            Totals.push(Number(salesTotal))

                            totalSum += salesTotal
                            cashSum += salesTotalCash
                            cardSum += salesTotalCard

                            console.log(`${month.key}/${day.key}: `,salesTotal, salesTotalCash, salesTotalCard)

                            datatoload.push([new Date(year.key, month.key-1, day.key), salesTotal])

                            salesTotalDisp.innerHTML = "$ "+ totalSum
                            salesTotalCashDisp.innerHTML = "$ "+ cashSum
                            salesTotalCardDisp.innerHTML = "$ "+ cardSum

                            

                    })    
                    getAvg(Totals)
                }
            )            
        })
    })
    drawChart()
}

function getAvg(sales) {
    if (sales.length === 0) return 'Empty grades array';
    let avg = sales.reduce((acc, c) => acc + c, 0) / sales.length;
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    dailyAverage.textContent = USDollar.format(avg)
    monthlyEstimate.textContent = USDollar.format(30.41*avg)

    console.log("Promedio: ",(avg))
    return avg  
  }


 // Load the Visualization API and the piechart package.
 google.charts.load('current', {'packages':['corechart']});
 google.charts.load('current', {'packages':['table']});
 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(drawChart);

 


function drawChart() {

    setTimeout(() => {
    
     // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Fecha');
    data.addColumn('number', 'Sales');       
    data.addRows(datatoload);
    
     // Set chart options
    var options = {
                    'height':'300',
                    'hAxis':{format:"M/d HH:mm"},
                    'vAxis': {format:"$ ",minValue: 0, maxValue: 10, gridlines: {
                        count: 5
                      }},
                    'colors':['#009900'],
                    'aggregationTarget': 'category',
                    'backgroundColor':'transparent',
                    'curveType': 'function',
                    'legend': { position: "none" },
                    'trendlines':{ 0: {'color': 'red',
                                        'type': 'polynomial',
                                        'degree': '2'}
                                    },
                    'width':`${window.innerWidth}`
                };
    
     // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

     
    chart.draw(data, options);
    }, "1000");
    
    
}