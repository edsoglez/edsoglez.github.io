const userButton = document.getElementById('user-button')
const filterButton = document.getElementById('filter-button')

const addButton = document.getElementById('add-button')

addButton.addEventListener('focus',()=>{
    location.href = "additem.html"
})



userButton.addEventListener('focus',()=>{
    userButton.style.transform = 'translate(-160px,0px)'
    userButton.style.height = '200px'
    userButton.style.width = '200px'
    userButton.innerHTML = ""
})

userButton.addEventListener('blur',()=>{
    userButton.style.transform = 'translate(0px,0px)'
    userButton.style.height = '50px'
    userButton.style.width = '50px'

    userButton.innerHTML=`<img class="icon" width="20px" style="margin: 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACP0lEQVR4nO3aT4hNURwH8MM0I4SJxdhMWVgoOyILyp+UhYWRBY2srFBWk42FJFPUpPxJNrKZrZJJSVZjJ4uJycLGGP9S5qFo/Pvo9t4Sw7jnvXOe+6lXb3EX5/ftnnvO+d0bQqVSqTQJ1uIkRjGBabzGGK6iD/NDu8F63PVn3uAY5oXcYU6jmG/+3gP0hlxhLob9m2dYGXKE08rxGN0hJ9iG78pzLWQ27+8rV/EMWRNygO3iGA45wKVIAdTQFVKHJ+LZGDKY/9MRA+gPKcMycQ2ElGFB5AAOhdRhKmIAu0Lq1E96saS/LcZApOIfhRxgBT5HCOB4yAUullx80TRZFHKBHrwoMYD9IdP218cSih8KucKOxh5+toqp1BFyhlWzOB6/xcHQLtTPCPsaQfyuUfISZ7A0tCv04kCxrOECTuEINhR9xFaPr1KpNG2jtBrrGr/if09oR+jA1sZ7gnsz7AtqjWuKa7dk/VDEcgxi0uxNNsLI5+5AN87hk/IUW+ohLAkpwx68Ek+xUdodUoOuiO8DfuY8OkMKsBC3NN+dlvcI1LvAMXuAMxlt2Rcl6svbiNa70ZIjs/ohJhUnml385ll+9hJLMZZNzXzij0vPw6asDDgqXYdjF9+Jp9I1EfUbAvRL396YAdyWvpFYxS/FV+n7gsUxAuiTj50xAjgrH4MxArgpH9djBDAuH2MxAnguHxMxAqjJx1SMAD7Ix/sqgLKp7gD//RR4Jx+1GFPgSmJdoF8pxni59AAqlUpoRz8ALkTf4bIRf58AAAAASUVORK5CYII=">`
})

filterButton.addEventListener('focus',()=>{
    filterButton.style.transform = 'translate(-50px,0px)'
    filterButton.style.height = '200px'
    filterButton.style.width = '100px'

    filterButton.innerHTML = ""
})

filterButton.addEventListener('blur',()=>{
    filterButton.style.transform = 'translate(0px,0px)'
    filterButton.style.height = '50px'
    filterButton.style.width = '50px'

    filterButton.innerHTML = `<img class="icon" width="20px" style="margin: 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR4nO3Zr0teURzH8TNFRMQkLAwMC5YVg8kyDEsm09rammFhVf+ARZtNsJhMpqUFncE4FhYWDIbBQNDBmOj2kgcVThB/PD733u8Z5/0HXO6Lz+XCuTelWuDwWTnt3AYpqlQhBS2yp5z2boM8xTfx+45nd725pnAgbod4ft/X8DR+iNdPvLgXIsPM4EicjjH7IESGmcOvrgX4jZd9ITLMK/zpEHGKhUchMswizjpAnOP1QBAZ5g3+toj4h7cDRWSYpRYh7xtBZJiVFhDLjSIyzIcGEautIK4gT7DWAGK9d+3WIFeYIWwOELGF4VYRGWYE2wNAfMRoJ4gMM4ZPj0D0jtfjKUIY7/O8v4+JFClM9gGZTBHzwFLUVEiw1EWCpS4SLHWRYKmLBEtdJFjqIsFSFwkWdv+Xg9UI3uGkaMh1vf972Cgech3m8bV4yF2PWyoxNzxuqeRc/sr70vs62fW91FKDXQBLWu3l0s62iwAAAABJRU5ErkJggg==">`
})