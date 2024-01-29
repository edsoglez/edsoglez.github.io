let Filter = localStorage.getItem("Filter")
Filter==null ? localStorage.setItem("Filter","All"):null;

let Summary = localStorage.getItem("Summary")
Summary==null ? localStorage.setItem("Summary",0):null;

let FilterBy = localStorage.getItem("FilterBy")
FilterBy==null ? Reload():null;

import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
let DateInfo = new Date()
let date = String(DateInfo)
let dt = date

let Vendors = ["Costco","Sams","Origen","Unica","Etrusca","Dummy"]

for (let i = 0; i < Vendors.length; i++) {
    let currentlist = Vendors[i]+"-items"
    document.getElementById(currentlist).innerHTML = ``

    onValue(itemRef,(snapshot)=>{
        snapshot.forEach(
        function(Child){
               if(Child.val().Vendor == Vendors[i] && Child.val().Cantidad != 0){
                document.getElementById(currentlist).innerHTML += `
                    <li>
                        <div class='item' style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <div style="width: 300px">${Child.key}</div>
                            <div style="width: 10px">${Child.val().Cantidad}</div>
                            <div style="width: 50px">${Child.val().Urgente ? "Urg":""}</div>
                            <div style="width: 150px; text-align: right;">${String(Child.val().Date).substring(0,10)}</div>
                        </div>
                    </li>
                    
                `
                
               }
        })
    })
}

setTimeout(() => {
    
  }, "1000");

