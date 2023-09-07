import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
    window.fieldUsername = document.querySelector("#enterUsername");
    window.fieldPassword = document.querySelector("#enterPassword");
    
    submitButton.addEventListener('click',findUser);
    fieldPassword.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
        event.preventDefault();
        console.log("Enter pressed")
          // Trigger the button element with a click
        submitButton.click();
        }
    });

    const dbref = ref(db)

        function findUser(){
            
            
            get(child(dbref,'Users/'+fieldUsername.value))
            .then((snapshot)=>{
                if(snapshot.exists()){
                    if(snapshot.val().password == fieldPassword.value){
                        window.USER = snapshot.val();
                        localStorage.setItem("USER",USER.username)
                        localStorage.setItem("canEdit",USER.canEdit)
                        localStorage.setItem('canAdd',USER.canAdd)
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

        

