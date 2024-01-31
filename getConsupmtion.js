import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');

var datatoload = []

 onValue(transRef,(snapshot)=>{
     snapshot.forEach(
         function(Child){
             let cantidadPedida = 0;
             Child.forEach(
                 function(GChild){
                    cantidadPedida = cantidadPedida + GChild.val().Cantidad
                    datatoload[Child.key] =  cantidadPedida
                 }
             )
             
         }
     )
 })
 
 // Load the Visualization API and the piechart package.
 google.charts.load('current', {'packages':['corechart']});
 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(drawChart);

 // Callback that creates and populates a data table, 
 // instantiates the pie chart, passes in the data and
 // draws it.
function drawChart() {

setTimeout(() => {

 // Create the data table.
 var data = new google.visualization.DataTable();
 data.addColumn('string', 'Articulo');
 data.addColumn('number', 'Cantidad');    

console.log("adding columns")
data.addRows(Object.entries(datatoload));

 // Set chart options
 var options = {'title':'Consumo:',
                 'width':600,
                 'height':300,
                 'bar': {groupWidth: "95%"},
                 'legend': { position: "none" },};

 // Instantiate and draw our chart, passing in some options.
 var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
 chart.draw(data, options);
 }, "1000");


}