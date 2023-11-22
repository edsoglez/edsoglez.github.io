import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
let DateInfo = new Date()
let date = String(DateInfo)
let dt = date


let Filter = localStorage.getItem("Filter")
Filter==null? localStorage.setItem("Filter","All"):null;


let Summary = localStorage.getItem("Summary")
Summary==null? localStorage.setItem("Summary",false):null;



const List = document.getElementById('itemList')


    onValue(itemRef,(snapshot)=>{
        try{
            List.innerHTML = ""
        }catch(e2){}
    
        snapshot.forEach(
        function(Child){
                Render(Child,Filter)
            
        })
    })



function Render(Child,filter){
    let Summarize = localStorage.getItem("Summary")
    let day = date.substring(8,10)
    let DateMod = Child.val().Date

    let DaysSince = Number(day - DateMod.substring(7,10))

    if(DaysSince < 0){
        DaysSince = (30 - Number(DateMod.substring(7,10))) + Number(day)
    }
        
    let urgente = null
    Child.val().Cantidad!=0? urgente=Child.val().Urgente: null;
    
    try{
        if(true){
            if(Child.val().Categoria==filter||filter=="All"){
                List.innerHTML += 
                    `<li id="${Child.val().Text}">
                    <div style="display:flex" class="list-item">
                        <div style="width:50%; text-align: left; padding-left:10px">${Child.val().Text}</div>
                        <div style="display:flex; flex-direction: row;">
                            <button class="quant-control" onclick="decreaseQty('${Child.key}',${Child.val().Cantidad})">-</button>
                            <button class="quant-control" onclick="increaseQty('${Child.key}',${Child.val().Cantidad})">+</button>
                        </div>
                        <div style="width:80px"><button class="quant-button" onclick="zeroQty('${Child.key}')">${Child.val().Cantidad}</button></div>
                        <div><button class="urgente-${urgente}" onclick="urgentToggle('${Child.key}',${Child.val().Urgente})">${DaysSince}D</button></div>
                    </div>
                    <span id="${Child.val().Text}-date" class="date-container"></span>
                    </li>`
            }
        }
    }catch(e){}

}

export function increaseQty(id,current){
    update(ref(db,'Items/'+id),{
    Cantidad: current +1,
    });
}
export function decreaseQty(id,current){
    if(current==0) return
    update(ref(db,'Items/'+id),{
    Cantidad: current -1,
    });
}
export function zeroQty(id){
    update(ref(db,'Items/'+id),{
    Cantidad: 0,
    });
}
export function urgentToggle(id,current){
    update(ref(db,'Items/'+id),{
    Urgente: !current,
    });
}

export function addItemToDB(id,categoria,vendor){

    if(id==""||categoria==""||vendor==""){
        alert("Todos los campos deben llenarse")
        return
    } 

    set(ref(db,'Items/'+id),{
        Text: id,
        Urgente: false,
        Date: date,
        Cantidad: 0,
        Categoria: categoria,
        Vendor: vendor
        });

    alert("Articulo añadido")

    document.getElementById("add-item-input").value = ""
    document.getElementById("add-categoria-select").value = ""
    document.getElementById("add-vendor-select").value = ""
}
window.addItemToDB = addItemToDB;

window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.zeroQty = zeroQty;
window.urgentToggle = urgentToggle;

