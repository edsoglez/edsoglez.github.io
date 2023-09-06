import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
    
      

    submitButton.addEventListener('click',findUser);
        function findUser(){
            window.fieldUsername = document.querySelector("#enterUsername");
            window.fieldPassword = document.querySelector("#enterPassword");
            const dbref = ref(db)
            get(child(dbref,'Users/'+fieldUsername.value))
            .then((snapshot)=>{
                if(snapshot.exists()){
                    if(snapshot.val().password == fieldPassword.value){
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

