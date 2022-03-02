function getById(id){
    return document.getElementById(id)
}
const form = getById("form");
const tbody = getById("tbody");
const date = getById("date");
const today = new Date().toISOString().slice(0, 10);
date.value = today;




form.addEventListener("submit", function(e){
    e.preventDefault();
    const inputElements = [...this.elements];
    const formData = {};
    let isValid = true;
    inputElements.forEach(input =>{
        if(input.type != "submit"){
            if(input.value == ""){
                alert("Please fill up the value!!");
                isValid = false;
                return;
            }
            formData[input.name] = input.value;
        }
        
    })
    if(isValid){
        formData.status = "incomplete"
        formData.id = uuidv4();
        const getTask = getTaskFromLocalStorage();

        displayToUi(formData,getTask.length + 1)
        getTask.push(formData);
        setTaskLocalStorage(getTask)
    }
    
    this.reset()
});

window.onload = function(){
    const getTask = getTaskFromLocalStorage();
    getTask.forEach((task, index) =>{
        displayToUi(task, index + 1);
    })
}

function displayToUi({name, priority, status, date, id}, index){
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr>
    <td id='no'>${index}</td>
    <td id='name'>${name}</td>
    <td id='priority'>${priority}</td>
    <td id='status'>${status}</td>
    <td id='date'>${date}</td>
    <td>
        <button id="delete"><i class="fa-solid fa-trash"></i></button>
        <button id="check"><i class="fa-solid fa-square-check"></i></button>
        <button id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
    </td>
</tr>
    `;
    tr.dataset.id = id;
    tbody.appendChild(tr);
}
//=================================
function getTaskFromLocalStorage(){
    const data = localStorage.getItem("tasks");
    let tasks = [];
    if(data){
        tasks = JSON.parse(data)
    }
    return tasks
}
//set task localStorage to Ui
function setTaskLocalStorage(getTask){
    localStorage.setItem("tasks", JSON.stringify(getTask))
}
//================Action===================
tbody.addEventListener("click", function(event){
    if(event.target.id == "delete"){
        const tr = event.target.parentElement.parentElement;
        const id = tr.dataset.id;
        tr.remove();
        let getTask = getTaskFromLocalStorage();
        getTask = getTask.filter(task => {
            if(task.id !== id){
                return task;
            }
        });
        setTaskLocalStorage(getTask)
    }else if(event.target.id == "check"){
        const tr = event.target.parentElement.parentElement;
        const id = tr.dataset.id;
        const td = tr.children;
        [...td].forEach(idNum => {
            if(idNum.id == "status"){
                let getTask = getTaskFromLocalStorage();
                getTask = getTask.filter(task => {
                    if(task.id === id){

                        if(task.status == "incomplete"){
                            task.status = "complete";
                            idNum.innerText = "complete";
                        }else{
                            task.status = "incomplete";
                            idNum.innerText = "incomplete";
                        }

                        return task;
                    }else{
                        return task;
                    }
                });
                setTaskLocalStorage(getTask)
                
            }
        })
    }
    
})