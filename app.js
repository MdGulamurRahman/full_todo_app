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
    inputElements.forEach(input =>{
        if(input.type != "submit"){
            formData[input.name] = input.value;
        }
        
    })
    formData.status = "incomplete"
    displayToUi(formData);
    this.reset()
})
function displayToUi({name, priority, status, date}){
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr>
    <td>0</td>
    <td>${name}</td>
    <td>${priority}</td>
    <td>${status}</td>
    <td>${date}</td>
    <td>
        <button id="delete"><i class="fa-solid fa-trash"></i></button>
        <button id="check"><i class="fa-solid fa-square-check"></i></button>
        <button id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
    </td>
</tr>
    `;
    tbody.appendChild(tr);
}