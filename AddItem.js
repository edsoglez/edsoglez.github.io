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

createButton.addEventListener('click',addItem);

const dbref = ref(db)

function addItem(){
    window.fieldText = document.querySelector("#enterText");
    window.fieldCategoria = document.querySelector("#enterCategoria");
    
    if(fieldText.value == ""){
        alert("Cannot leave item blank")
        return
    }
    
    get(child(dbref,'Items/'+fieldText.value))
    .then((snapshot)=>{
        if(canAdd=="true"){
            if(snapshot.exists()){
                alert("id taken")
            }
            else{
                set(ref(db,'Items/'+fieldText.value),{
                    id: fieldText.value,
                    Text: fieldText.value,
                    Categoria: fieldCategoria.value,
                    Cantidad: 0,
                    Urgente: false,
                })
                fieldText.value= "";
            }
        }
        else{
            alert("Usuario no tiene permiso de agregar")
        }
        
    });
    
}