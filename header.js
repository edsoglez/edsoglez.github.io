import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
const userButton = document.getElementById('user-button')
const filterButton = document.getElementById('filter-button')

const addButton = document.getElementById('add-button')

addButton.addEventListener('focus',()=>{
    location.href = "additem.html"
})
localStorage.removeItem

userButton.addEventListener('focus',()=>{
    userButton.style.transform = 'translate(-100px,0px)'
    userButton.style.height = '200px'
    userButton.style.width = '150px'
    userButton.innerHTML = `
        Usuario: ${localStorage.getItem("USER")}
        <br>
        <button onmousedown="localStorage.removeItem('USER');location.href = 'index.html'">Cerrar Sesión</button>
    `
})

userButton.addEventListener('blur',()=>{
    userButton.style.transform = 'translate(0px,0px)'
    userButton.style.height = '50px'
    userButton.style.width = '50px'

    userButton.innerHTML=`<img class="icon" width="20px" style="margin: 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACP0lEQVR4nO3aT4hNURwH8MM0I4SJxdhMWVgoOyILyp+UhYWRBY2srFBWk42FJFPUpPxJNrKZrZJJSVZjJ4uJycLGGP9S5qFo/Pvo9t4Sw7jnvXOe+6lXb3EX5/ftnnvO+d0bQqVSqTQJ1uIkRjGBabzGGK6iD/NDu8F63PVn3uAY5oXcYU6jmG/+3gP0hlxhLob9m2dYGXKE08rxGN0hJ9iG78pzLWQ27+8rV/EMWRNygO3iGA45wKVIAdTQFVKHJ+LZGDKY/9MRA+gPKcMycQ2ElGFB5AAOhdRhKmIAu0Lq1E96saS/LcZApOIfhRxgBT5HCOB4yAUullx80TRZFHKBHrwoMYD9IdP218cSih8KucKOxh5+toqp1BFyhlWzOB6/xcHQLtTPCPsaQfyuUfISZ7A0tCv04kCxrOECTuEINhR9xFaPr1KpNG2jtBrrGr/if09oR+jA1sZ7gnsz7AtqjWuKa7dk/VDEcgxi0uxNNsLI5+5AN87hk/IUW+ohLAkpwx68Ek+xUdodUoOuiO8DfuY8OkMKsBC3NN+dlvcI1LvAMXuAMxlt2Rcl6svbiNa70ZIjs/ohJhUnml385ll+9hJLMZZNzXzij0vPw6asDDgqXYdjF9+Jp9I1EfUbAvRL396YAdyWvpFYxS/FV+n7gsUxAuiTj50xAjgrH4MxArgpH9djBDAuH2MxAnguHxMxAqjJx1SMAD7Ix/sqgLKp7gD//RR4Jx+1GFPgSmJdoF8pxni59AAqlUpoRz8ALkTf4bIRf58AAAAASUVORK5CYII=">`
})

filterButton.addEventListener('focus',()=>{
    filterButton.style.transform = 'translate(-200px,0px)'
    filterButton.style.height = 'auto'
    filterButton.style.width = '300px'

    setTimeout(()=>{
        filterButton.innerHTML = `
        <h3>Categoria</h3>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Categoria');localStorage.setItem('Filter','Desechable');flagUpdate()">Desechable</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Categoria');localStorage.setItem('Filter','Insumo');flagUpdate()">Insumo</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Categoria');localStorage.setItem('Filter','Pasteles');flagUpdate()">Pasteles</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Categoria');localStorage.setItem('Filter','Sabor');flagUpdate()">Sabor</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Categoria');localStorage.setItem('Filter','Bebidas');flagUpdate()">Bebidas</button>
        <h3>Vendor</h3>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Vendor');localStorage.setItem('Filter','Costco');flagUpdate()">Costco</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Vendor');localStorage.setItem('Filter','Sams');flagUpdate()">Sams</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Vendor');localStorage.setItem('Filter','Unica');flagUpdate()">Unica</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Vendor');localStorage.setItem('Filter','Origen');flagUpdate()">Origen</button>
        <button class="filter-button" onmousedown="localStorage.setItem('FilterBy','Vendor');localStorage.setItem('Filter','Dummy');flagUpdate()">Dummy</button>
        <h3>Resumen</h3>
        <button class="filter-button" onmousedown="localStorage.setItem('Summary',Number(!Boolean(Number(localStorage.getItem('Summary')))) );flagUpdate()">Summary</button>
        
        `
    },100)
    
})

filterButton.addEventListener('blur',()=>{
    filterButton.style.transform = 'translate(0px,0px)'
    filterButton.style.height = '50px'
    filterButton.style.width = '50px'

    filterButton.innerHTML = `<img class="icon" width="20px" style="margin: 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR4nO3Zr0teURzH8TNFRMQkLAwMC5YVg8kyDEsm09rammFhVf+ARZtNsJhMpqUFncE4FhYWDIbBQNDBmOj2kgcVThB/PD733u8Z5/0HXO6Lz+XCuTelWuDwWTnt3AYpqlQhBS2yp5z2boM8xTfx+45nd725pnAgbod4ft/X8DR+iNdPvLgXIsPM4EicjjH7IESGmcOvrgX4jZd9ITLMK/zpEHGKhUchMswizjpAnOP1QBAZ5g3+toj4h7cDRWSYpRYh7xtBZJiVFhDLjSIyzIcGEautIK4gT7DWAGK9d+3WIFeYIWwOELGF4VYRGWYE2wNAfMRoJ4gMM4ZPj0D0jtfjKUIY7/O8v4+JFClM9gGZTBHzwFLUVEiw1EWCpS4SLHWRYKmLBEtdJFjqIsFSFwkWdv+Xg9UI3uGkaMh1vf972Cgech3m8bV4yF2PWyoxNzxuqeRc/sr70vs62fW91FKDXQBLWu3l0s62iwAAAABJRU5ErkJggg==">`
})

function flagUpdate(){
    location.reload();
}

window.flagUpdate = flagUpdate