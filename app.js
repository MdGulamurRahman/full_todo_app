function getById(id){
    return document.getElementById(id)
}
const form = getById("form");
const tbody = getById("tbody");
const searchField = getById("s_name")
const filterField = getById("filter");
const sortField = getById("sort");
const by_date = getById("by_date");
const date = getById("date");
const bulkPriority = getById("bulk_priority");
const bulkStatus = getById("bulk_status");
const bulkEditInp = getById("edit_inp");
const bulkEditSelect = getById("edit_sel");
const today = new Date().toISOString().slice(0, 10);
date.value = today;


//searching correct vule
searchField.addEventListener("input", function(e){
    filterField.selectedIndex = 0;
    tbody.innerHTML = ""
    const searchTerm = this.value;
    const getTask = getTaskFromLocalStorage();
    let index = 0;
    getTask.forEach(task =>{
        if(task.name.toLowerCase().includes(searchTerm.toLowerCase())){
            index++;
            displayToUi(task, index)
        }
    })
})
//filtering area
filterField.addEventListener("change", function(e){
    searchField.value = ""; 
    tbody.innerHTML = ""
    const filterFieldTerm = this.value;
    const getTask = getTaskFromLocalStorage();
    switch(filterFieldTerm){
        case "all":
            getTask.forEach((task, i) =>{
                displayToUi(task, i + 1)
            })
            break;
        case "complete":
            let index1 = 0;
            getTask.forEach(task =>{
                if(task.status === "complete"){
                    index1++
                    displayToUi(task, index1)
                }
            })
            break;
        case "incomplete":
            let index2 = 0;
            getTask.forEach(task =>{
                if(task.status === "incomplete"){
                    index2++;
                    displayToUi(task, index2)
                }
            })
            break;
        case "today":
            let index3 = 0;
            getTask.forEach(task =>{
                if(task.date === today){
                    index3++
                    displayToUi(task, index3)
                }
            })
            break;
        case "high":
            let index4 = 0;
            getTask.forEach(task =>{
                if(task.priority === "high"){
                    index4++;
                displayToUi(task, index4)
                }
                
            })
            break;
        case "medium":
            let index5 = 0;
            getTask.forEach(task =>{
                if(task.priority === "medium"){
                    index5++;
                displayToUi(task, index5)
                }
                
            })
            break;
        case "low":
            let index6 = 0;
            getTask.forEach(task =>{
                if(task.priority === "low"){
                    index6++;
                displayToUi(task, index6)
                }
                
            })
            break;
        
    }
})
//sorting area
sortField.addEventListener("change", function(e){
    tbody.innerHTML = "";
    filterField.selectedIndex = 0;
    searchField.value = ""
    const sortTerm = this.value;
    const getTask = getTaskFromLocalStorage();
    if(sortTerm === "newest"){
        getTask.sort((a,b)=>{
            if(new Date(a.date) > new Date(b.date)){
                return -1;
            }else if(new Date(a.date) < new Date(b.date)){
                return 1;
            }else{
                return 0;
            }
        })
    }else{
        getTask.sort((a,b)=>{
            if(new Date(a.date) > new Date(b.date)){
                return 1;
            }else if(new Date(a.date) < new Date(b.date)){
                return -1;
            }else{
                return 0;
            }
        })
    }
    getTask.forEach((task, i)=>{
        displayToUi(task, i + 1);
    })
})
//find with date
by_date.addEventListener("change", function(e){
    const ByDateTerm = this.value;
    tbody.innerHTML = "";
    filterField.selectedIndex = 0;
    searchField.value = ""
    const getTask = getTaskFromLocalStorage();
    if(ByDateTerm){
        let index = 0;
        getTask.forEach(task =>{
            if(task.date === ByDateTerm){
                index++;
                displayToUi(task, index)
            }
        })
    }else{
        getTask.forEach(task, i =>{
            if(task.date === ByDateTerm){
                displayToUi(task, i + 1)
            }
        })
    }
    
})

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
    getById("date").value = today;
});

window.onload = function(){
    const getTask = getTaskFromLocalStorage();
    getTask.forEach((task, index) =>{
        displayToUi(task, index + 1);
    })
}
// selected area
let selectedTask = [];
function selectFunc(e){
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const isChacked = e.target.checked;
    if(isChacked){
        selectedTask.push(tr);
        bulkActionHandler();
    }else{
        const index = selectedTask.findIndex((tr) => tr.dataset.id === id);
        selectedTask.splice(index, 1);
        bulkActionHandler();
    }
}
//all selected
getById("all_select").addEventListener("change", function(e){
    const isChacked = e.target.checked;
    const checkBoxes = document.querySelectorAll(".checkbox");
    selectedTask = [];
    if(isChacked){
        ;[...checkBoxes].forEach(box => {
            const tr = box.parentElement.parentElement;
            selectedTask.push(tr)
            box.checked = true;
            bulkActionHandler();
        })
    }else{
        ;[...checkBoxes].forEach(box => {
            box.checked = false;
            bulkActionHandler();
        })
    }
    
})
//bulk action area 
function bulkActionHandler(){
    if(selectedTask.length){
        getById("bulk_action").style.display = "flex"
    }else{
        getById("bulk_action").style.display = "none"
    }
}
//dismiss area
document.querySelector(".dismiss").addEventListener("click", function(e){
    bulkPriority.selectedIndex = 0;
    bulkStatus.selectedIndex = 0;
    bulkEditInp.type = "text";
    bulkEditInp.value = "";
    bulkEditSelect.selectedIndex = 0;
    const checkBoxes = document.querySelectorAll(".checkbox");
    ;[...checkBoxes].forEach(box => {
        box.checked = false;
       
    })
    getById("all_select").checked = false;
    selectedTask = [];
    bulkActionHandler();
})
//delete selected task from localStorage
getById("bulk_delete").addEventListener("click", function(e){
    let getTask = getTaskFromLocalStorage();
    selectedTask.forEach(tr =>{
        const id = tr.dataset.id;
        getTask = getTask.filter(task => task.id !== id)
        tr.remove()
    });
    setTaskLocalStorage(getTask)
});

// bulkPriority area
bulkPriority.addEventListener("change", function(e){
    const selectPriority = this.value;
    let getTask = getTaskFromLocalStorage();
    selectedTask.forEach(tr =>{
        const id = tr.dataset.id;
        [...tr.children].forEach(td =>{
            if(td.id == "priority"){
                td.innerHTML = selectPriority;
            }
        })
        getTask = getTask.filter(task =>{
            if(task.id == id){
                task.priority = selectPriority;
                return task;
            }else{
                return task;
            }
        });
    })
    
    setTaskLocalStorage(getTask)
})

//bulkStatus area
bulkStatus.onchange = function(e){
    const selectStatus = this.value;
    let getTask = getTaskFromLocalStorage();
    selectedTask.forEach(tr =>{
        const id = tr.dataset.id;
        [...tr.children].forEach(td =>{
            if(td.id == "status"){
                td.innerHTML = selectStatus;
            }
        })
        getTask = getTask.filter(task =>{
            if(task.id == id){
                task.status = selectStatus;
                return task;
            }else{
                return task;
            }
        });
    })
    
    setTaskLocalStorage(getTask)
}
//bulk edit input or bulk edit select
bulkEditSelect.onchange = function(e){
    if(this.value == "name"){
        bulkEditInp.type = "text";
        bulkEditInp.value = ""
    }else{
        bulkEditInp.type = "date";
        bulkEditInp.value = ""
    }
}

bulkEditInp.oninput = function(e){
    if(this.type == "text"){
        const modifiedName = this.value;
        let getTask = getTaskFromLocalStorage();
        selectedTask.forEach(tr =>{
            const id = tr.dataset.id;
            [...tr.children].forEach(td =>{
                if(td.id == "name"){
                    td.innerHTML = modifiedName;
                }
            })
            getTask = getTask.filter(task =>{
                if(task.id == id){
                    task.name = modifiedName;
                    return task;
                }else{
                    return task;
                }
            });
        })
        
        setTaskLocalStorage(getTask)
    }else{
        const modifiedDate = this.value;
        let getTask = getTaskFromLocalStorage();
        selectedTask.forEach(tr =>{
            const id = tr.dataset.id;
            [...tr.children].forEach(td =>{
                if(td.id == "date"){
                    td.innerHTML = modifiedDate;
                }
            })
            getTask = getTask.filter(task =>{
                if(task.id == id){
                    task.date = modifiedDate;
                    return task;
                }else{
                    return task;
                }
            });
        })
        
        setTaskLocalStorage(getTask)
    }
}

function displayToUi({name, priority, status, date, id}, index){
    const tr = document.createElement("tr");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.addEventListener("change", selectFunc)
    tr.innerHTML = `
    <tr>
    <td id="checkbox"></td>
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
    tr.firstElementChild.appendChild(checkbox);
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