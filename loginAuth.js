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

export function ChangePass(_username,_password,_newpassword){
    get(child(ref(db),`Users/`+_username)).then((snapshot) => {
        if (snapshot.exists()) {
            if(snapshot.val().password == _password){
                update(ref(db,'Users/'+_username),{
                    password: _newpassword
                    });
                alert("Contraseña de "+localStorage.getItem("USER")+" modificada correctamente")
            }
            else{
                alert("Contraseña original incorrecta")
            }

        } else {
            console.log("No user found");
        }
    });
}

try{
    document.querySelector('#username').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            Auth(document.getElementById('username').value,document.getElementById('password').value)
        }
    });
    document.querySelector('#password').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            Auth(document.getElementById('username').value,document.getElementById('password').value)
        }
    });
}catch(exception){
    document.querySelector('#change-pass-button').addEventListener('click', ()=>{
        ChangePass(localStorage.getItem("USER"),document.querySelector('#currentPass').value,document.querySelector('#newPass').value)
        
    })
    
}




window.ChangePass = ChangePass;
window.Auth = Auth;