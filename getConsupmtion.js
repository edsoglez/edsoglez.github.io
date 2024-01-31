import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');



onValue(itemRef,(snapshot)=>{
    document.getElementById("item-choose").innerHTML += `<option value="${localStorage.getItem('graph-item')}">${localStorage.getItem('graph-item')}</option>`
    snapshot.forEach(
        function(Child){
            document.getElementById("item-choose").innerHTML += `<option value="${Child.key}">${Child.key}</option>`
            console.log(Child.key)
    })
})

var datatoload = []
var datatoload2 = []
onValue(transRef,(snapshot)=>{
    snapshot.forEach(
        function(Child){
            
            if(Child.key == localStorage.getItem("graph-item")){
            let fechaPedido = ""
            let cantidadPedida = 0;
            let receiver = ""
             Child.forEach(
                 function(GChild){
                    fechaPedido = (String(GChild.key).substring(8,10))
                    console.log(fechaPedido)
                    cantidadPedida = GChild.val().Cantidad
                    receiver = GChild.val().Modder
                    datatoload.push([Number(fechaPedido), cantidadPedida])
                    datatoload2.push([Number(fechaPedido), cantidadPedida, receiver])
                 }
             )
            console.log(datatoload) 
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
 data.addColumn('number', 'Fecha');
 data.addColumn('number', 'Cant Recibo');    
 data2.addColumn('number', 'Fecha');
 data2.addColumn('number', 'Cant Recibo');    
 data2.addColumn('string', 'Quien');    
console.log("adding columns")
data.addRows(datatoload);
data2.addRows(datatoload2);

 // Set chart options
 var options = {'title':'Consumo:',
                'hAxis.format':{format:"#"},
                'aggregationTarget': 'category',
                'backgroundColor':'transparent',
                'curveType': 'function',
                'legend': { position: "none" },};

 // Instantiate and draw our chart, passing in some options.
 var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
 var table = new google.visualization.Table(document.getElementById('chart_div2'));
 chart.draw(data, options);
 table.draw(data2, options);
 }, "1000");


}