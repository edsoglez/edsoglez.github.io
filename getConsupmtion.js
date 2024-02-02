import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');


get(child(ref(getDatabase()), `Items/`)).then((snapshot) => {
    document.getElementById("item-choose").innerHTML += `<option value="${localStorage.getItem("graph-item")}">${localStorage.getItem("graph-item")}</option>`
    snapshot.forEach(
        function(Child){
            console.log(Child.val())
            document.getElementById("item-choose").innerHTML += `<option value="${Child.key}">${Child.key}</option>`
            if(Child.key == localStorage.getItem("graph-item")){
                document.getElementById("itemPackQty").innerHTML = Child.val().PackQty
            }
    })
  })

get(child(ref(getDatabase()), `Inventory/${localStorage.getItem("graph-item")}`)).then((snapshot) => {
    document.getElementById("itemCurrentInv").innerHTML = snapshot.val().Cantidad
})

var datatoload = []
var datatoload2 = []

get(child(ref(getDatabase()), `Transactions/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){
            
            if(Child.key == localStorage.getItem("graph-item")){
            let cantidadPedida = 0;
            let receiver = ""
             Child.forEach(
                 function(GChild){
                    let año = Number(String(GChild.key).substring(0,4))
                    let mes = Number(String(GChild.key).substring(5,7))-1
                    let dia = Number(String(GChild.key).substring(8,9))
                    cantidadPedida = GChild.val().Cantidad
                    receiver = GChild.val().Modder
                    datatoload.push([new Date(año,mes,dia), cantidadPedida])
                    datatoload2.push([new Date(año,mes,dia), cantidadPedida, receiver])
                 }
             )
            }
             
        }
    )
 })
 
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
 var data2 = new google.visualization.DataTable();
 data.addColumn('date', 'Fecha');
 data.addColumn('number', 'Cant Recibo');    
 data2.addColumn('date', 'Fecha');
 data2.addColumn('number', 'Cant Recibo');    
 data2.addColumn('string', 'Quien');    
data.addRows(datatoload);
data2.addRows(datatoload2);

 // Set chart options
 var options = {'title':'Recibos de: '+localStorage.getItem("graph-item"),
 'height':'300',
                'hAxis.format':{format:"#"},
                'vAxis': {minValue: 0, maxValue: 10, gridlines: {
                    count: 5
                  }},
                'colors':['#CC0000'],
                'aggregationTarget': 'category',
                'backgroundColor':'transparent',
                'curveType': 'function',
                'legend': { position: "none" },};

var cssClassNames = {
                    'headerRow': 'italic-darkblue-font large-font bold-font red-background',
                    'tableRow': 'table-row',
                    'oddTableRow': 'beige-background',
                    'selectedTableRow': 'orange-background large-font',
                    'hoverTableRow': '',
                    'headerCell': 'gold-border',
                    'tableCell': '',
                    'rowNumberCell': 'underline-blue-font'};
                    
var options2 = {'showRowNumber': false, 'allowHtml': true, 'cssClassNames': cssClassNames};

 // Instantiate and draw our chart, passing in some options.
 var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
 var table = new google.visualization.Table(document.getElementById('chart_div2'));
 chart.draw(data, options);
 table.draw(data2, options2);
 }, "1000");


}