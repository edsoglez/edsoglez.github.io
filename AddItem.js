import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
    
createButton.addEventListener('click',addItem);
const dbref = ref(db)

function addItem(){
    window.fieldId = document.querySelector("#enterId");
    window.fieldText = document.querySelector("#enterText");

    get(child(dbref,'Items/'+fieldId.value))
    .then((snapshot)=>{
        if(snapshot.exists()){
            alert("id taken")
            fieldId.value= "";
        }
        else{
            set(ref(db,'Items/'+fieldId.value),{
                id: fieldId.value,
                Text: fieldText.value,
                Cantidad: 0,
                Urgente: false,
            })
            alert("Item created!")
            fieldId.value= "";
            fieldText.value= "";
        }
    });
    
}