import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import {setUser} from "https:calesa.cloud/user.js"    
    submitButton.addEventListener('click',findUser);

    const dbref = ref(db)

        function findUser(){
            window.fieldUsername = document.querySelector("#enterUsername");
            window.fieldPassword = document.querySelector("#enterPassword");
            
            get(child(dbref,'Users/'+fieldUsername.value))
            .then((snapshot)=>{
                if(snapshot.exists()){
                    if(snapshot.val().password == fieldPassword.value){
                        window.USER = snapshot.val();
                        setUser(USER);
                        console.log(USER);
                        location.href = 'order.html';
                    }
                    else{
                        alert('invalid password')
                        fieldUsername.value = ""
                        fieldPassword.value = ""
                    }
                }
                else{   
                    alert('user not found')
                    fieldUsername.value = ""
                    fieldPassword.value = ""
                }   
            })
            
        }

        

