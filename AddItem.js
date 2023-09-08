import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
    
try{
    //will try to get variable data from localstorage
    window.loggedUser = localStorage.getItem("USER");
    window.canEdit = localStorage.getItem("canEdit");
    window.canAdd = localStorage.getItem("canAdd");
}
catch(exception){
    location.href = 'index.html';
}

//Checks if has been logged in, else sends to login page on load
if(loggedUser == null){
    location.href = 'index.html';
}
//defines input elements
window.fieldText = document.querySelector("#enterText");
window.fieldCategoria = document.querySelector("#enterCategoria");
createButton.addEventListener('click',addItem);

//gives input functionality for submiting with Enter Keypress
fieldText.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
    event.preventDefault();
    console.log("Enter pressed")
      // Trigger the button element with a click
    createButton.click();
    fielfText.value=""
    }
});

//refrences DB in current scope
const dbref = ref(db)

function addItem(){
    //Checks if field is empty
    if(fieldText.value == ""){
        alert("Cannot leave item blank")
        return //if empty exit function, since it would erase all DB items
    }
    else{
        //looks for Item typed in in DB
        get(child(dbref,'Items/'+fieldText.value))
        .then((snapshot)=>{
            if(canAdd=="true"){ //Checks users permisions
                if(snapshot.exists()){ //If found, user must choose other ID
                    alert("id taken")
                    return
                }
                else{ //If item doesnt exist, adds it to DB with default parameters
                    set(ref(db,'Items/'+fieldText.value),{
                        id: fieldText.value,
                        Text: fieldText.value,
                        Categoria: fieldCategoria.value,
                        Cantidad: 0,
                        Urgente: false,
                    })
                    fieldText.value= ""; //Resets input field
                }
            }
            else{
                alert("Usuario no tiene permiso de agregar")
            }
            
        });
    }
    
    
}