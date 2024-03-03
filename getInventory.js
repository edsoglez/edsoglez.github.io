import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
let UOM = "";

get(child(ref(getDatabase()), `Items/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){

            get(child(ref(getDatabase()), `Inventory/${Child.key}`)).then((snapshot) => {
                let invQty = snapshot.val().Cantidad
                let ordQty = Child.val().Cantidad
                let packQty = Child.val().PackQty
                
 
                document.getElementById("item-list-inv").innerHTML +=
                `<li id="${Child.val().Text}">

                <div style="display:flex" class="list-item">
                    <div style="width:50%; text-align: left; padding-left:10px">
                        <button class="item-button" onclick="document.getElementById('${Child.key}-hidden').style.visibility='visible'">${Child.val().Text}</button>
                    </div>

                    <div style="width:0">
                        <div class="hidden-menu" id="${snapshot.key}-hidden">

                                    <div style="display:flex; height: 30px;">   
                                        <div style="width:80%; height:30px; text-align: left;">
                                            <H3>${snapshot.key} </h3>
                                        </div>  

                                        <div style="width:20%; height:30px; text-align: right; display: inline-block">
                                            <button class="close-button" onclick="document.getElementById('${snapshot.key}-hidden').style.visibility = 'hidden'">X</button>
                                        </div>      
                                    </div>

                                    <div stle="text-align: left; padding: 0">
                                    Inventario: <input type="number" value="${snapshot.val().Cantidad}" id="${snapshot.key}-inventario" class="packQty-input" onchange="updateItemInventory('${snapshot.key}',this.value);">
                                    </div>
                                    

                        </div>
                    </div> 

                    <div style="width:50%; text-align: right; display: flex; justify-content: right; text-align: right; align-items: right; padding-right: 10px">
                        <div id="${snapshot.key}-inv-qty" style="width:100px; text-align: right">${invQty}</div>
                        <div style="width:100px; text-align: right">${ordQty*packQty}</div>
                    </div>
            
                </div>
                <span id="${Child.val().Text}-date" class="date-container"></span>
                
                </li>`

            })

    })
  })
function updateItemInventory(item,quant){
    if(confirm("Seguro de actualizar?")){
        update(ref(db,`Inventory/${item}`),{
            Cantidad: Number(quant),
        });
    
        console.log(`Updated ${item} to ${quant}`)
        document.getElementById(item+"-inv-qty").innerText = quant
    }
    
}

function resetInventory(item){

    if(typeof(item)=='string'){
        update(ref(db,`Inventory/${item}`),{
            Cantidad: 0,
        });
        console.log(`Set ${item} to 0`)
        return
    }

    if(typeof(item)=='number'){
        get(child(ref(getDatabase()), `Items/`)).then((snapshot) => {
            snapshot.forEach(
                function(Child){
    
                    try{
                        update(ref(db,`Inventory/${Child.key}`),{
                            Cantidad: item,
                        });
                        console.log(`Set ${Child.key} to ${item}`)
                    }
                    catch(e){
                        console.log("no se pudo con "+ Child.key)
                    }
                    
    
            })
          })
        return
    }

    get(child(ref(getDatabase()), `Items/`)).then((snapshot) => {
        snapshot.forEach(
            function(Child){

                try{
                    update(ref(db,`Inventory/${Child.key}`),{
                        Cantidad: 0,
                    });
                    console.log(`Set ${Child.key} to 0`)
                }
                catch(e){
                    console.log("no se pudo con "+ Child.key)
                }
                

        })
      })
}

window.resetInventory = resetInventory
window.updateItemInventory = updateItemInventory