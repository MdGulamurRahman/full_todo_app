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
    <td id='action'>
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
    }else if(event.target.id == "edit"){
        const table_tr = event.target.parentElement.parentElement;
        const id = table_tr.dataset.id;
        const table_td = table_tr.children;
        //name
        let nameTd;
        let newNameField;
        //priority
        let priorityTd;
        let prioritySelect;
        //date
        let dateTd;
        let dateSelect;
        //button
        let buttonTd;
        let preButtons;


        [...table_td].forEach(td => {

            if(td.id === "name"){
                nameTd = td;
                const preName = td.textContent;
                td.innerText = "";
                //create input
                newNameField = document.createElement("input");
                newNameField.type = "text";
                newNameField.classList = "dynamic_input"
                newNameField.value = preName;
                td.appendChild(newNameField);
            }else if(td.id === "priority"){
                priorityTd = td;
               const prePriority = td.textContent;
               td.innerText = "";
               prioritySelect = document.createElement("select");
               prioritySelect.className = "dynamic_select"
               prioritySelect.innerHTML = `
                    <option disabled>Select One</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
               `;
               if(prePriority == "high"){
                prioritySelect.selectedIndex = 1;
               }else if(prePriority == "medium"){
                prioritySelect.selectedIndex = 2;
               }else if(prePriority == "low"){
                prioritySelect.selectedIndex = 3
               }
               td.appendChild(prioritySelect)
            }else if(td.id === "date"){
                dateTd = td;
               const preDate = td.textContent;
               td.innerText = "";
               dateSelect = document.createElement("input");
               dateSelect.type = "date";
               dateSelect.classList = "dynamic_input"
               dateSelect.value = preDate;
               td.appendChild(dateSelect)
            }else if(td.id === "action"){
                buttonTd = td;
                preButtons = td.innerHTML;
                td.innerHTML = "";
                const saveBtn =  document.createElement("button");
                saveBtn.innerHTML = '<button"><i class="fa-solid fa-floppy-disk"></i></button>';
                saveBtn.addEventListener("click", function(){
                    //name
                    const nameField = newNameField.value;
                    nameTd.innerHTML = nameField;
                    //priority
                    const priorityField = prioritySelect.value;
                    priorityTd.innerHTML = priorityField;
                    //date 
                    const dateField = dateSelect.value;
                    dateTd.innerHTML = dateField;
                    //button
                    buttonTd.innerHTML = preButtons;
                    //the area of localStorage
                    let getTask = getTaskFromLocalStorage();
                    getTask = getTask.filter(task =>{
                        if(task.id == id){
                            task.name = nameField;
                            task.priority = priorityField;
                            task.date = dateField;
                            return task;
                        }else{
                            return task;
                        }
                    });
                    setTaskLocalStorage(getTask)
                });
                td.appendChild(saveBtn)
            }



        })
        
    }
    
})