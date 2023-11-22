import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
let DateInfo = new Date()
let date = String(DateInfo)
let dt = date


let Filter = localStorage.getItem("Filter")
Filter==null? localStorage.setItem("Filter","All"):null;


let Summary = localStorage.getItem("Summary")
Summary==null? localStorage.setItem("Summary",false)="False":null;



const List = document.getElementById('itemList')

onValue(itemRef,(snapshot)=>{
    List.innerHTML = ""

    snapshot.forEach(
    function(Child){
            Render(Child,Filter)
        
    })
})

function Render(Child,filter){
    let day = date.substring(8,10)
    let DateMod = Child.val().Date

    let DaysSince = Number(day - DateMod.substring(7,10))

    if(DaysSince < 0){
        DaysSince = (30 - Number(DateMod.substring(7,10))) + Number(day)
    }
        
    let urgente = null
    Child.val().Cantidad!=0? urgente=Child.val().Urgente: null;
    
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

window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.zeroQty = zeroQty;
window.urgentToggle = urgentToggle;



