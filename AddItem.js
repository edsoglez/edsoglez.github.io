import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
    
createButton.addEventListener('click',addItem);
const dbref = ref(db)

function addItem(){
    window.fieldText = document.querySelector("#enterText");

    get(child(dbref,'Items/'+fieldText.value))
    .then((snapshot)=>{
        if(snapshot.exists()){
            alert("id taken")
            fieldId.value= "";
        }
        else{
            set(ref(db,'Items/'+fieldText.value),{
                Text: fieldText.value,
                Cantidad: 0,
                Urgente: false,
            })
            fieldText.value= "";
        }
    });
    
}