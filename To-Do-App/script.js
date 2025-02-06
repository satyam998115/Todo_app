function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let li = document.createElement("li");
    li.innerHTML = `${taskText} <button onclick="removeTask(this)">❌</button>`;
    li.addEventListener("click", function() {
        this.classList.toggle("completed");
    });
    
    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
}
function removeTask(button) {
    button.parentElement.remove();
}