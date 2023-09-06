import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
        submitButton.addEventListener('click',findUser);

        function findUser(){
            const dbref = ref(db)
            get(child(dbref,'Users/'+fieldUsername.value))
            .then((snapshot)=>{
                if(snapshot.exists()){
                    if(snapshot.val().password == fieldPassword.value){
                        alert('Correct user and password')
                    }
                    else{
                        alert('invalid password')
                    }
                }
                else{   
                    alert('user not found')
                }   
            })
        }

