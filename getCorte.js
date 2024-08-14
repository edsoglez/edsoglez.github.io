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

let dateSelector = document.getElementById('from-date')

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
let resumenPromos = document.getElementById('resumen-promos')
let resumen10 = document.getElementById('resumen-10')
let resumen11 = document.getElementById('resumen-11')
let resumen12 = document.getElementById('resumen-12')
let resumen13 = document.getElementById('resumen-13')
let resumen14 = document.getElementById('resumen-14')
let resumen15 = document.getElementById('resumen-15')
let resumen16 = document.getElementById('resumen-16')
let resumen17 = document.getElementById('resumen-17')
let resumen18 = document.getElementById('resumen-18')
let resumen19 = document.getElementById('resumen-19')
let resumen20 = document.getElementById('resumen-20')

let corteButton = document.getElementById('corteButton')

resumen10.textContent = resumen11.textContent = resumen12.textContent = resumen13.textContent = resumen14.textContent = resumen15.textContent = resumen16.textContent = resumen17.textContent = resumen18.textContent = resumen19.textContent = resumen20.textContent = 0; 

let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")



//Changing the value in the DOM divs
dateSelector.value = date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today

dateSelector.addEventListener('change',() => {
    renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""))
    drawChart()
})

get(child(ref(getDatabase()), `Products/`)).then((Products) => {

    Products.forEach((Product) => {
        productIndexes[Product.key] = Product.val().index
    })

    onValue(salesRef,(snapshot)=>{
        renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""))
    })
    
})

corteButton.addEventListener('click',()=>{
    let year = String(dateSelector.value).replace(/-/g,"").substring(0,4)
    let month = String(dateSelector.value).replace(/-/g,"").substring(4,6)
    let day = String(dateSelector.value).replace(/-/g,"").substring(6,8)

    console.log(year+"/"+Number(month)+"/"+day)

    get(child(ref(db),`Cortes/${year}/${Number(month)}/${String(day).padStart(2, '0')}`)).then((corte) => {
        console.log(corte.val())

        alert(`
        Fecha: ${String(day).padStart(2, '0')}/${(month)}/${year}\n
        Mat: \n ${
        String(JSON.stringify(corte.val().Mat)).replace(/,/g,'\n').replace(/{/g,'\n').replace(/}/g,'\n').replace(/"/g,'')
        } 
        Vesp: \n ${
        String(JSON.stringify(corte.val().Vesp)).replace(/,/g,'\n').replace(/{/g,'\n').replace(/}/g,'\n').replace(/"/g,'')
        }`)
    })
})

totalSelector.addEventListener('click',()=>{
    renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""))
})
cashSelector.addEventListener('click',()=>{
    renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""),'cash')
})
cardSelector.addEventListener('click',()=>{
    renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""),'card')
})


let salesList = document.getElementById('sales-list')
var datatoload = []

document.getElementById('search').addEventListener('click',()=>{
    renderSales(String(dateSelector.value).replace(/-/g,""),String(dateSelector.value).replace(/-/g,""))
    drawChart()
})

function renderSales(fromDate,toDate,method){
    salesTotalCardDisp.innerText = 0
    salesTotalCashDisp.innerText = 0
    salesTotalDisp.innerText = 0
    let salesTotal = 0
    datatoload = []
    salesList.innerHTML = ''
    
    resumenFrios.textContent = 0;
    resumenCalientes.textContent = 0;
    resumenPasteles.textContent = 0;
    resumenBebidas.textContent = 0;
    resumenVarios.textContent = 0;
    resumenPromos.textContent = 0;

    resumen10.textContent = resumen11.textContent = resumen12.textContent = resumen13.textContent = resumen14.textContent = resumen15.textContent = resumen16.textContent = resumen17.textContent = resumen18.textContent = resumen19.textContent = resumen20.textContent = 0; 

    let lastUpdate = String(new Date()).substring(0,25)
    document.getElementById('last-update').innerHTML = lastUpdate
    console.log("Rendering sales from",fromDate.replace(/-/g,""),"to",toDate.replace(/-/g,"")) //SERIALIZE DATE TO LATER COMPARE GREATER AND LESS THAN

    let [yearSel,monthSel,daySel] = String(dateSelector.value).split('-')
    console.log(yearSel,monthSel,daySel)
    get(child(ref(db),`SalesMigrated/${yearSel}/${Number(monthSel)}/${daySel}`)).then((sales) => {

        sales.forEach((transaction)=>{
            console.log(transaction.key, transaction.val().Total, transaction.val().Method)

            salesTotalDisp.innerText = Number(salesTotalDisp.innerText) + transaction.val().Total
            if(transaction.val().Method == 'card'){
                salesTotalCardDisp.innerText = Number(salesTotalCardDisp.innerText) + transaction.val().Total
            }
            else{
                salesTotalCashDisp.innerText = Number(salesTotalCashDisp.innerText) + transaction.val().Total
            }

            salesList.innerHTML += `
                                        <li class="sale-item-li">
                                            <div class="sale-item-div" style="">
                                                <div style="width: 25%; text-align: left;">${String(transaction.key).substring(4, 6)+"/"+String(transaction.key).substring(6, 8)}</div>
                                                <div style="width: 30%; text-align: left;">${String(transaction.val().Time)}</div>
                                                <div style="width: 10%"; text-align: right">$</div>
                                                <div style="width: 15%"; text-align: left" onclick="updatetransactionDetail(${transaction.key})">${+transaction.val().Total}</div>
                                                <div onclick="toggleMethod(${transaction.key})" style="width: 30%"; text-align: left>${transaction.val().Method}</div>
                                                <div style="width: 10%; text-align: right; color: red; height: 100%; transform: translate(-4px, 2px);" onclick="updateSaleDetail('${transaction.key}')">
                                                     <img height="20px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1200px-Infobox_info_icon.svg.png" alt="">
                                                </div>
                                            <div>
                                        </li>
                                    `

            salesTotal += transaction.val().Total
            let years = transaction.key.substring(0,4)
            let monthIndex = Number(transaction.key.substring(4,6))-1
            let day = transaction.key.substring(6,8)
            let hours = transaction.val().Time.substring(0,2)
            let minutes = transaction.val().Time.substring(3,5)
            let seconds = transaction.val().Time.substring(6,8)
           
            datatoload.push([new Date(years, monthIndex, day, hours, minutes, seconds), salesTotal])
            drawChart()

            //breaks down order and gets individual item category for summary
            Object.entries(transaction.val().Items).forEach((item)=>{
                try{
                let product = item[0].split('_')[0]
                let category = productIndexes[item[0].split('_')[0]]
              
                document.getElementById(`resumen-${category}`).textContent = Number(document.getElementById(`resumen-${category}`).textContent) + item[1]
                }
                catch(error){
                
                }

            })
            try{
            document.getElementById(`resumen-${String(transaction.val().Time).split(':')[0]}`).textContent = Number(document.getElementById(`resumen-${String(transaction.val().Time).split(':')[0]}`).textContent) + Number(transaction.val().Total)
            }
            catch(e){
                console.log(e)
            }
        })
    
    })
}

 // Load the Visualization API and the piechart package.
 google.charts.load('current', {'packages':['corechart']});
 google.charts.load('current', {'packages':['table']});
 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(drawChart);

 // Callback that creates and populates a data table, 
 // instantiates the pie chart, passes in the data and
 // draws it.

function deleteSale(sale_key){

    let years = String(sale_key).substring(0,4)
    let monthIndex = Number(String(sale_key).substring(4,6))

    console.log(years,monthIndex)

    get(child(ref(db),`Users/${localStorage.getItem('USER')}`)).then((user) => {
        if(!confirm("Seguro quiere borrar esta orden?")){
            alert("Abortado")
            return
        }

       if(String(user.val().canDelete) == "true"){
        remove(child(ref(db),`Sales/${years}/${monthIndex}/${daySel}/${sale_key}`))
        .then(function() {
            alert(`Venta ${sale_key} borrada\nmonto: ${sale.val().total}`)
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
       }
       else{
            alert("no tiene permiso para borrar ventas")
       }
        
    })

    document.getElementById('sale-detail').style.visibility = 'hidden'

    
}

function toggleMethod(sale_key){
    
    let year = String(sale_key).substring(0,4)
    let month = Number(String(sale_key).substring(4,6))
    console.log(year,month)
    get(child(ref(db),`SalesMigrated/${year}/${month}/${daySel}/${sale_key}`)).then((sale) => {
        console.log("Metodo actual: ",sale.val().Method)
        console.log(sale.val().Method == "cash" ? "card" : "cash")

        if(confirm("Seguro que quieres cambiar el metodo de pago de $ " + sale.val().Total + " en " + sale.val().Method + " a " + (sale.val().Method == "cash" ? "card" : "cash"))){
            update(ref(db,`SalesMigrated/${year}/${month}/${daySel}/${sale_key}`),{
                Method: sale.val().Method == "cash" ? "card" : "cash",
            }).then(
                updateSaleDetail(sale_key)
            );
        }
        
    })

}

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

function reprintTicket(sale_key){
    let year = String(sale_key).substring(0,4)
    let monthIndex = Number(String(sale_key).substring(4,6))
    let orderedItems = {}

    get(child(ref(db),`Sales/${year}/${monthIndex}/${sale_key}`)).then((sale) => {
        Object.entries(sale.val().Items).forEach((item)=>{
            orderedItems[item[0]] = item[1]
        })
    
        localStorage.myArray = JSON.stringify(orderedItems)
        let duration = 10
        setTimeout(() => {
            location.href = "receipt.html?duration="+duration
        },500)
        
    })
}

function updateSaleDetail(sale_key){
    let year = String(sale_key).substring(0,4)
    let monthIndex = Number(String(sale_key).substring(4,6))

    get(child(ref(db),`Sales/${year}/${monthIndex}/${sale_key}`)).then((sale) => {
        console.log(sale.val())
        document.getElementById('sale-detail-items').textContent = ""

        document.getElementById('sale-detail-total').textContent = sale.val().Total
        document.getElementById('sale-detail-seller').textContent = sale.val().Seller
        document.getElementById('sale-detail-time').textContent = sale.val().Time
        document.getElementById('sale-detail-method').textContent = sale.val().Method
        document.getElementById('sale-detail').style.visibility = 'visible'

        
        Object.entries(sale.val().Items).forEach((item)=>{
            document.getElementById('sale-detail-items').innerHTML += `<li><div style="width:200px; display: inline-block">${item[0]}</div>${item[1]}</li>`
        })

        document.getElementById('actions').innerHTML = `
        <button class="change-method" id="sale-detail-change-method" onclick="toggleMethod(${sale_key})">Cambiar Metodo</button>
        <button class="reprint-ticket" id="sale-detail-reprint-ticket" onclick="reprintTicket(${sale_key})">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRKI3xu7Gnuu5dWaAHQjAWR9hv9OnjfSvEXTDvt4dbJLCHqVRymgXlaF39F-Cd24vtqvg&usqp=CAU" height="18" style="margin: 0px; transform: scale(1.3); filter: invert(1); mix-blend-mode: lighten;">
        </button>
        <br>
        <button class="delete-sale" id="sale-detail-delete" onclick="deleteSale(${sale_key})">Borrar Venta</button>`

    })
    
}
window.reprintTicket = reprintTicket

window.updateSaleDetail = updateSaleDetail
window.toggleMethod = toggleMethod
window.deleteSale = deleteSale