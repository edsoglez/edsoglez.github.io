import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

localStorage.getItem("USER")==null ? location.href="index.html":null;

let Filter = localStorage.getItem("Filter")
Filter==null ? localStorage.setItem("Filter","All"):null;
let Summary = localStorage.getItem("Summary")
Summary==null ? localStorage.setItem("Summary",0):null;
let FilterBy = localStorage.getItem("FilterBy")
FilterBy==null ? Reload():null;

window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');

var Months = {
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "Jun":"06",
    "Jul":"07",
    "Aug":"08",
    "Sep":"09",
    "Oct":"10",
    "Nov":"11",
    "Dec":"12"
} 

let DateInfo = new Date()
let date = String(DateInfo)
let year = date.substring(11,15)
let month = Months[date.substring(4,7)]
let day = Number(date.substring(8,10))
let hour = date.substring(16,18)
let minute = date.substring(19,21)
let second = date.substring(22,24)
let time = hour+":"+minute+":"+second

function Reload(){
    localStorage.setItem("FilterBy","Categoria");
    location.href = "order.html" 
}

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

    

window.tapSound = new Audio();
tapSound.src="/click.wav";
tapSound.preload='auto';

function playSound() {
    tapSound.currentTime=0.001;
    //tapSound.play();
}


function Render(Child,filter){
     if(FilterBy=="Categoria"){
        if((Child.val().Categoria==filter||filter=="All")&&(Child.val().Cantidad>0||!Boolean(Number(Summary)))){
            renderListItem(Child)
        }
    }
        
    if(FilterBy=="Vendor"){
        if(Child.val().Vendor==filter&&(Child.val().Cantidad>0||!Boolean(Number(Summary)))){
            renderListItem(Child)
        }
    }
}

function renderListItem(Child){
    let day = date.substring(8,10)
    let DateMod = Child.val().Date
    let DaysSince = Number(day - DateMod.substring(7,10))
    if(DaysSince < 0){
        DaysSince = (30 - Number(DateMod.substring(7,10))) + Number(day)
    }
    let urgente = null

    Child.val().Cantidad!=0? urgente=Child.val().Urgente: null;

    List.innerHTML += 
                       `<li id="${Child.val().Text}">
                        <div style="display:flex" class="list-item">
                            <div style="width:100%; text-align: left; padding-left:10px">
                                <button class="item-button" onclick="document.getElementById('${Child.key}-hidden').style.visibility = 'visible'">${Child.val().Text}</button>
                            </div>
                            <div style="width:0">
                                <div class="hidden-menu" id="${Child.key}-hidden">

                                    <div style="display:flex; height: 30px;">   
                                        <div style="width:80%; height:30px; text-align: left;">
                                            <H3>${Child.key} </h3>
                                        </div>  
                                        <div style="width:20%; height:30px; text-align: right; display: inline-block">
                                            <button class="close-button" onclick="document.getElementById('${Child.key}-hidden').style.visibility = 'hidden'">X</button>
                                        </div>      
                                    </div>
                                    <div style="width:100%; text-align: left;">
                                        Unidades: <input id="${Child.key}-packQty" value="${Child.val().PackQty}" class="packQty-input" type="number" placeholder="${Child.val().PackQty}">${Child.val().UOM}
                                    </div>
                                    <div style="width:100%; text-align: left;">Fecha Orden: ${Child.val().Date.substring(3,10)}</div>
                                    <div style="width:100%; text-align: left;">Pide: ${Child.val().Modder}</div>
                                    
                                    <div style="width:100%; height:0px; text-align: right; display: flex; align-items: center; justify-content: right">
                                            <button class="receive-button-${Child.val().Cantidad>0?'on':'off'}" onclick="zeroQty('${Child.key}','${Child.val().Cantidad}')">Recibir ${Child.val().Cantidad}</button>
                                    </div>    
                                </div>
                            </div> 

                            <div style="display:flex; flex-direction: row;">
                                <button class="quant-control" onclick="decreaseQty('${Child.key}',${Child.val().Cantidad})">-</button>
                                <button class="quant-control" onclick="increaseQty('${Child.key}',${Child.val().Cantidad})">+</button>
                            </div>

                            <div style="width:80px"><input type="number" class="quant-button" value="${Child.val().Cantidad}" style="text-align: center" onchange="changeQty('${Child.key}',this.value)"></div>
                            <div><button class="urgente-${urgente}" onclick="urgentToggle('${Child.key}',${Child.val().Urgente})">${DaysSince}D</button></div>
                        </div>
                        <span id="${Child.val().Text}-date" class="date-container"></span>
                        </li>`

                   

}

export function changeQty(id,newVal){
    let regex = /^[0-9]+$/;
    if (newVal.replace(/\D/g,'') == "")
    {
        alert("Solo ingresar numeros");
        return false;
    }

    update(ref(db,'Items/'+id),{
        Cantidad: newVal,
        Date: date,
        Modder: localStorage.getItem("USER")
        });
}

export function increaseQty(id,current){
    update(ref(db,'Items/'+id),{
    Cantidad: current +1,
    Date: date,
    Modder: localStorage.getItem("USER")
    });
}
export function decreaseQty(id,current){
    if(current==0) return
    update(ref(db,'Items/'+id),{
    Cantidad: current -1,
    Date: date,
    Modder: localStorage.getItem("USER")
    });
}
export function zeroQty(id,currentQty){
    if(currentQty == 0){
        return
    }

    if(confirm('Seguro de recibir? \nRecibiras '+currentQty+' paquete de '+document.getElementById(id+'-packQty').value)){
        ingressQty(id)
        update(ref(db,'Items/'+id),{
        Cantidad: 0,
        Date: date,
        Modder: localStorage.getItem("USER")
        });
    }
}
export function urgentToggle(id,current){
    update(ref(db,'Items/'+id),{
    Urgente: !current,
    Modder: localStorage.getItem("USER")
    });
}

export function ingressQty(id){
    //get current item's ordered cuantity
    get(child(ref(getDatabase()), `Items/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let currentOrderedQty = snapshot.val().Cantidad
            let actualPackQty = document.getElementById(id+"-packQty").value
            console.log(actualPackQty)

            //Add qty reception
            set(ref(db,'Transactions/'+id+"/"+year+"_"+month+"_"+day+"_"+time+"_"+Math.floor(Math.random() * 99)),{
                Cantidad: currentOrderedQty*actualPackQty,
                Modder: localStorage.getItem("USER")
            });
            //get and update current inventory + received
            get(child(ref(getDatabase()), `Inventory/${id}`)).then((snapshot) => {

                let actualPackQty = document.getElementById(id+'-packQty').value

                set(ref(db,'Inventory/'+id),{
                    Cantidad: snapshot.val().Cantidad + currentOrderedQty*actualPackQty,
                    LastMod: new Date()
                });

            })

        
        } else {
          console.log("No data available");
        }
      })
    //guardar dicha cantidad en base de datos como historico
    
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
        Vendor: vendor,
        Modder: localStorage.getItem("USER"),
        PackQty: 1
    });

    set(ref(db,'Inventory/'+id),{
            Cantidad: 0,
            LastMod: new Date()
            });

    alert("Articulo añadido")

    document.getElementById("add-item-input").value = ""
    document.getElementById("add-categoria-select").value = ""
    document.getElementById("add-vendor-select").value = ""
}
window.addItemToDB = addItemToDB;
window.ingressQty = increaseQty;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.zeroQty = zeroQty;
window.urgentToggle = urgentToggle;
window.playSound = playSound;
window.changeQty = changeQty;

