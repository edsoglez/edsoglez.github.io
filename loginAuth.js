import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

export function Auth(_username,_password){
  
get(child(ref(db),`Users/`+_username)).then((snapshot) => {
        if (snapshot.exists()) {
            if(snapshot.val().password == _password){
                localStorage.setItem("USER",_username);
                location.href = "order.html"
            }
            else{
                alert("Wrong password")
            }

        } else {
            console.log("No user found");
        }
});
    
}

window.Auth = Auth;