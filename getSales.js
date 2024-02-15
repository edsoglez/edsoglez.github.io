import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.salesRef = ref(db,'Sales/');

let fromDateVal = document.getElementById('from-date')
let toDateVal = document.getElementById('to-date')
let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")

let salesTotalDisp = document.getElementById('sales-total')
let salesTotalCashDisp = document.getElementById('sales-total-cash')
let salesTotalCardDisp = document.getElementById('sales-total-card')

let salesList = document.getElementById('sales-list')
let Months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12',
}

var datatoload = []


onValue(salesRef,(snapshot)=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})

fromDateVal.value = date[3]+"-"+month.slice(-2)+"-01"    //from Date is start current month 
toDateVal.value =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today

renderSales(date[3]+"-"+month.slice(-2)+"-01",date[3]+"-"+month.slice(-2)+"-"+date[2]) //Default renders from current month day 1 to today

fromDateVal.addEventListener('change',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    drawChart()
})
toDateVal.addEventListener('change',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    drawChart()
})

document.getElementById('search').addEventListener('click',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    drawChart()
})

function renderSales(fromDate,toDate){
    let lastUpdate = String(new Date()).substring(0,25)
    document.getElementById('last-update').innerHTML = lastUpdate
    console.log("Rendering sales from",fromDate.replace(/-/g,""),"to",toDate.replace(/-/g,"")) //SERIALIZE DATE TO LATER COMPARE GREATER AND LESS THAN
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))

    get(child(ref(db),'Sales/')).then((snapshot) => {
        let salesTotal = 0;
        let salesTotalCash = 0;
        let salesTotalCard = 0;
        datatoload = []
        salesList.innerHTML = ""

        snapshot.forEach(
        function(year){
            year.forEach(
                function(month){
                    month.forEach(
                        function(sale){
                            let saleDate = Number(sale.key.substring(0,8))    
                            

                            if(saleDate >= fromDateSerial && saleDate <= toDateSerial){
                                salesTotal += sale.val().Total
                                let years = sale.key.substring(0,4)
                                let monthIndex = Number(sale.key.substring(4,6))-1
                                let day = sale.key.substring(6,8)
                                let hours = sale.val().Time.substring(0,2)
                                let minutes = sale.val().Time.substring(3,5)
                                let seconds = sale.val().Time.substring(6,8)
                                console.log(years)
                                console.log(monthIndex)
                                console.log(day)
                                console.log(hours)
                                console.log(minutes)
                                console.log(seconds)
                                datatoload.push([new Date(years, monthIndex, day, hours, minutes, seconds), salesTotal])
                                console.log(datatoload)

                                if(sale.val().Method == 'cash'){
                                    salesTotalCash += sale.val().Total
                                }
                                    
                                if(sale.val().Method == 'card'){
                                    salesTotalCard += sale.val().Total
                                }
                                    
                                salesTotalDisp.innerHTML = "$ "+ salesTotal
                                salesTotalCashDisp.innerHTML = "$ "+ salesTotalCash
                                salesTotalCardDisp.innerHTML = "$ "+ salesTotalCard
                                salesList.innerHTML += `
                                    <li class="sale-item-li">
                                        <div class="sale-item-div" style="">
                                            <div style="width: 30%; text-align: left;">${String(sale.key).substring(4, 6)+"/"+String(sale.key).substring(6, 8)}</div>
                                            <div style="width: 30%; text-align: left;">${String(sale.val().Time)}</div>
                                            <div style="width: 5%"; text-align: right>$</div>
                                            <div style="width: 15%"; text-align: left>${+sale.val().Total}</div>
                                            <div style="width: 20%"; text-align: left>${sale.val().Method}</div>
                                        <div>
                                    </li>
                                `
                            }
                        
                        }
                    )
                }
            )            
        })
    })
    console.log(datatoload)
}

 // Load the Visualization API and the piechart package.
 google.charts.load('current', {'packages':['corechart']});
 google.charts.load('current', {'packages':['table']});
 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(drawChart);

 // Callback that creates and populates a data table, 
 // instantiates the pie chart, passes in the data and
 // draws it.
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
                                    }
                };
    
     // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
     
    chart.draw(data, options);
    }, "1000");
    
    
}