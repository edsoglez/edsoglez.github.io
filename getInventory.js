import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
let UOM = "";

get(child(ref(getDatabase()), `Items/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){

            get(child(ref(getDatabase()), `Inventory/${Child.val().Text}`)).then((snapshot) => {
                let invQty = snapshot.val().Cantidad
                let ordQty = Child.val().Cantidad
                let packQty = Child.val().PackQty

                document.getElementById("item-list-inv").innerHTML +=
                `<li id="${Child.val().Text}">
                <div style="display:flex" class="list-item">
                    <div style="width:50%; text-align: left; padding-left:10px">
                        <button class="item-button" onclick="localStorage.setItem('graph-item','${Child.val().Text}');location.href='consumos.html';">${Child.val().Text}</button>
                    </div>

                    <div style="width:50%; text-align: right; display: flex; justify-content: right; text-align: right; align-items: right; padding-right: 10px">
                        <div style="width:100px; text-align: right">${invQty}</div>
                        <div style="width:100px; text-align: right">${ordQty}</div>
                        <div style="width:100px; text-align: right">${ordQty*packQty}</div>
                    </div>
            
                    </div>
                <span id="${Child.val().Text}-date" class="date-container"></span>
                </li>`

            })

    })
  })



