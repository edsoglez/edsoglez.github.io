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

let resumenCalientes = document.getElementById('resumen-caliente')
let resumenFrios = document.getElementById('resumen-frio')
let resumenPasteles = document.getElementById('resumen-pastel')
let resumenBebidas = document.getElementById('resumen-bebidas')
let resumenVarios = document.getElementById('resumen-varios')

let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")

//Changing the value in the DOM divs
fromDateVal.value = date[3]+"-"+month.slice(-2)+"-01"    //from Date is start current month 
toDateVal.value =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today

get(child(ref(getDatabase()), `Products/`)).then((Products) => {
    Products.forEach((Product) => {
        productIndexes[Product.key] = Product.val().index
    })

    onValue(salesRef,(snapshot)=>{
        renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
    })
    
    renderSales(date[3]+"-"+month.slice(-2)+"-01",date[3]+"-"+month.slice(-2)+"-"+date[2]) //Default renders from current month day 1 to today
})

totalSelector.addEventListener('mouseover',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})
cashSelector.addEventListener('mouseover',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""),'cash')
})
cardSelector.addEventListener('mouseover',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""),'card')
})
totalSelector.addEventListener('blur',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})
cashSelector.addEventListener('blur',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})
cardSelector.addEventListener('blur',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})

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

function renderSales(fromDate,toDate,method){
    let lastUpdate = String(new Date()).substring(0,25)
    document.getElementById('last-update').innerHTML = lastUpdate
    console.log("Rendering sales from",fromDate.replace(/-/g,""),"to",toDate.replace(/-/g,"")) //SERIALIZE DATE TO LATER COMPARE GREATER AND LESS THAN
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))
  
    let monthsEvaluated = Number(toDate.replace(/-/g,"").substring(0,6)) - Number(fromDate.replace(/-/g,"").substring(0,6)) + 1
    let days = Number(String(toDateSerial).substring(6,8)) - Number(String(fromDateSerial).substring(6,8))+1 + (monthsEvaluated-1)*30
    

    get(child(ref(db),'Sales/')).then((snapshot) => {
        let salesTotal = 0;
        let salesTotalCash = 0;
        let salesTotalCard = 0;
        resumenFrios.textContent = 0;
        resumenCalientes.textContent = 0;
        resumenPasteles.textContent = 0;
        resumenBebidas.textContent = 0;
        resumenVarios.textContent = 0;
        
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
                                   
                                    datatoload.push([new Date(years, monthIndex, day, hours, minutes, seconds), salesTotal])
                                
    
                                    if(sale.val().Method == 'cash'){
                                        salesTotalCash += sale.val().Total
                                    }
                                        
                                    if(sale.val().Method == 'card'){
                                        salesTotalCard += sale.val().Total
                                    }
                                        
                                    salesTotalDisp.innerHTML = "$ "+ salesTotal
                                    salesTotalCashDisp.innerHTML = "$ "+ salesTotalCash
                                    salesTotalCardDisp.innerHTML = "$ "+ salesTotalCard
                                    
                                    if(sale.val().Method == method || method == null){
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
                                    //breaks down order and gets individual item category for summary
                                    Object.entries(sale.val().Items).forEach((item)=>{
                                        try{
                                        let product = item[0].split('_')[0]
                                        let category = productIndexes[item[0].split('_')[0]]
                                        console.log(product,category)
                                        document.getElementById(`resumen-${category}`).textContent = Number(document.getElementById(`resumen-${category}`).textContent) + item[1]
                                        }
                                        catch(error){
                                            console.log(item[0].split('_')[0])
                                        }

                                    })
                                    try{
                                    document.getElementById(`resumen-${String(sale.val().Time).split(':')[0]}`).textContent = Number(document.getElementById(`resumen-${String(sale.val().Time).split(':')[0]}`).textContent) + Number(sale.val().Total)
                                    }
                                    catch(e){
                                        console.log(e)
                                    }

                                }
                                    

                                    
                                }
                                
                        }
                    )
                    getDailyAverage(salesTotal,days,monthsEvaluated)
                }
            )            
        })
    })
}

function getDailyAverage(total,days,monthsEvaluated){
   

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    dailyAverage.textContent = USDollar.format(total/days)
    monthlyEstimate.textContent = USDollar.format(total*30.41*monthsEvaluated/days)
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