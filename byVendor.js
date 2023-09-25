import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

try{
    window.loggedUser = localStorage.getItem("USER");
    window.canEdit = localStorage.getItem("canEdit");
    window.canAdd = localStorage.getItem("canAdd");
}
catch(exception){
    location.href = 'index.html';
}
console.log(loggedUser)
if(loggedUser == null){
    location.href = 'index.html';
}

let DateInfo = new Date()
let date = String(DateInfo)
console.log(date)
let dt = date

console.log(dt)
//Test for multiple item
//console.log(USER); need to get USER varibale across all files from index
function Render(text,cantidad,urgente,id,Date,Modder){

    console.log(date)
    
    let ul = document.getElementById("itemList");
    let _text = document.createElement('li');
    let _date = document.createElement('li');
    let _cantidad = document.createElement('li');
    let _urgente = document.createElement('li');
    

    _text.classList.add('item')
    _date.classList.add('subinfo')
    _cantidad.classList.add('cantidad')
    _urgente.classList.add('urgencia')

    if (cantidad == 0 ){_urgente.classList.add('zero') } 
    else{   if (urgente == true){_urgente.classList.add('urgente') }
            else{_urgente.classList.add('non')} 
        }

    _date.innerHTML = "Modified "+Date.substring(4,11)+" by "+Modder+" @ "+Date.substring(16,21);
    _text.innerHTML = text;
    _cantidad.innerHTML = cantidad;
    _urgente.innerHTML = '_';

    ul.appendChild(_text);
    
    ul.appendChild(_cantidad);
    ul.appendChild(_urgente);
    ul.appendChild(_date);
    ul.append();

    _text.addEventListener("click", () => {

        if(canEdit=="true"){
            update(ref(db,'Items/'+id),{
                Cantidad: 0,
                Urgente: false,
                Date: dt,
                Modder: loggedUser
            });
        }
        else{
            
        }
        
    });
    
    
    _cantidad.addEventListener("click", () => {
        if(canEdit=="true"){
        update(ref(db,'Items/'+id),{
            Cantidad: cantidad + 1,
            Date: dt,
            Modder: loggedUser
        });
        }
        else{
            alert("Usuario no puede modificar")
        }
    });
    
    _urgente.addEventListener("click", () => {
    if(canEdit=="true"){
        if(urgente==true){
            update(ref(db,'Items/'+id),{
            Urgente: false,
            Date: dt,
            Modder: loggedUser
        });
        }    
        else{
            update(ref(db,'Items/'+id),{
            Urgente: true,
            Date: dt,
            Modder: loggedUser
        });
        } 
    }
    else{alert("Usuario no puede modificar")}
    });
}

selectVendor = document.querySelector("#selectVendor");
selectVendor.addEventListener('change', fakeUpdate)

function fakeUpdate(){

if(currentStatus){
    update(ref(db,'Items/Vaso Tp16'),{
        Fake: false
    });
    
}
else{
    update(ref(db,'Items/Vaso Tp16'),{
        Fake: true
    });
    
}
    

}


onValue(itemRef, (snapshot)=>{
        document.getElementById("itemList").innerHTML = "" // on change, reset to black and re-render
        snapshot.forEach(
            function(ChildSnapshot){
                let Text = ChildSnapshot.val().Text;
                let Cantidad = ChildSnapshot.val().Cantidad;
                let Urgente = ChildSnapshot.val().Urgente;
                let id = ChildSnapshot.val().id;
                let Date = ChildSnapshot.val().Date;
                let Modder = ChildSnapshot.val().Modder;

                if(ChildSnapshot.val().Text=="Vaso Tp16"){
                    window.currentStatus = ChildSnapshot.val().Fake;    
                }
                
                
                if(ChildSnapshot.val().Vendor==document.querySelector("#selectVendor").value){
                Render(Text,Cantidad,Urgente,id,Date,Modder);
                
                }
            }
        )
});



    