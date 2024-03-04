import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.usersRef = ref(db,'Users/');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userID = urlParams.get('editUser')

console.log(queryString)
console.log(urlParams)
console.log(userID)
document.getElementById("user-id").innerHTML = userID

get(child(ref(db),`/Users/${userID}`)).then((snapshot)=>{
    console.log(snapshot.key, snapshot.val())
    snapshot.forEach(permission => {
        
        try{
            document.getElementById(permission.key+"-button").innerHTML = " "+permission.val()
        }catch(e){
        }

    });
    
    
})

