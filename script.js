// Querying all necessary elements
const createButton = document.getElementById("createButton");
const listNameInput = document.getElementById("listNameInput");
const addListButton = document.getElementById("addListButton");
const renameBox = document.getElementsByClassName("renameBoxContainer");
const moveBox = document.getElementsByClassName("moveBoxContainer");
const inputContainer = document.getElementById("inputContainer");
const cardContainer = document.querySelector(".card");

// Event listener for showing the input box
createButton.addEventListener("click", () => {
    inputContainer.style.display = "inline";
});

// Event listener for creating a list
addListButton.addEventListener("click", () => {
    let listName = listNameInput.value;
    listNameInput.value = "";
    inputContainer.style.display = "none";

    let [listCard, listContainer] = createList(listName);
    if (listName !== "") {
        addPreDefinedContent(listContainer);
        cardContainer.append(listCard);
    }
});

// Function to create a list
function createList(name) {
    if (cardContainer.style.display === "none") {
        cardContainer.style.display = "flex";
    }

    const listCardElement = document.createElement("div");
    const listTitle = document.createElement("h1");
    const listContainerElement = document.createElement("ul");

    listTitle.textContent = name;
    listTitle.classList.add("listName");
    listCardElement.classList.add("listCard");
    listContainerElement.classList.add("listContainer");

    listContainerElement.append(listTitle);
    listCardElement.append(listContainerElement);

    return [listCardElement, listContainerElement];
}

// Function to add predefined content to the list
function addPreDefinedContent(listContainer) {
    // Add a remove list functionality
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("removeButton");
    listContainer.append(removeButton);

    removeButton.addEventListener("click", () => {
        // Confirmation prompt before removing the list
        const confirmation = confirm("Are you sure you want to remove this list?");
        if (confirmation) {
            listContainer.remove();

            // If no lists are left, hide the card container
            if (cardContainer.querySelectorAll(".listContainer").length === 0) {
                cardContainer.style.display = "none";
            }
        }
    });

    const taskAdderElement = document.createElement("h1");
    taskAdderElement.innerHTML = '<i class="fa-solid fa-plus"></i>Add Item';
    taskAdderElement.classList.add("taskAdder");

    taskAdderElement.addEventListener("click", () => {
        if (listContainer.querySelector(".taskInput")) {
            return;
        }

        const taskInputContainer = document.createElement("div");
        taskInputContainer.classList.add("taskInput");

        const taskNameInput = document.createElement("input");
        taskNameInput.placeholder = "Task";
        taskNameInput.classList.add("taskNameInput");

        const finalAddButton = document.createElement("button");
        finalAddButton.textContent = "Add";
        finalAddButton.classList.add("finalAddButton");

        taskInputContainer.append(taskNameInput, finalAddButton);
        listContainer.insertBefore(taskInputContainer, taskAdderElement);

        finalAddButton.addEventListener("click", () => {
            const taskName = taskNameInput.value;
            taskNameInput.value = "";

            if (taskName !== "") {
                addTasks(taskName, taskInputContainer, listContainer);
            }
        });
    });

    listContainer.appendChild(taskAdderElement);
}

// Function to add tasks to the list
function addTasks(taskName, taskContainer, listContainer) {
    const newTask = document.createElement("li");
    newTask.classList.add("task");
    newTask.textContent = taskName;

    const optionBar = document.createElement("i");
    optionBar.classList.add("fa-solid", "fa-ellipsis-vertical", "option-bar");
    newTask.append(optionBar);

    listContainer.replaceChild(newTask, taskContainer);

    optionBar.addEventListener("click", () => {
        showOptionPane(newTask);
    });
}

// Function to show the option pane for each task
function showOptionPane(parentTask) {
    if (parentTask.querySelector(".extraOptions")) {
        parentTask.querySelector(".extraOptions").remove();
    }

    const optionPane = document.createElement("ul");
    optionPane.classList.add("extraOptions");

    const optionList = ["Rename", "Move", "Delete"];
    optionList.forEach(value => {
        let element = document.createElement("li");
        element.textContent = value;
        element.classList.add("option");

        element.addEventListener("click", () => actionListener(parentTask, value));
        optionPane.appendChild(element);
    });

    parentTask.append(optionPane);

    optionPane.addEventListener("mouseleave", () => {
        setTimeout(optionPane.remove(), 5000);
    });
}

// Function to handle the actions based on the selected option
function actionListener(element, name) {
    switch (name) {
        case "Rename":
            renameTask(element);
            break;

        case "Move":
            moveTask(element);
            break;

        case "Delete":
            deleteTask(element);
            break;
    }
}

// Function to rename a task
function renameTask(element) {
    // Show the rename box
    renameBox[0].style.display = "block";

    // Disable all buttons except those inside the rename box
    disableAllButtonsExcept(renameBox[0]);

    const newName = document.getElementById("newName");
    const renameButton = document.getElementById("renameButton");
    const closeButton = document.getElementById("closeButton");

    // Set the current task name as the placeholder in the input box
    newName.value = element.childNodes[0].textContent;

    // Clear any existing event listeners before adding new ones
    renameButton.replaceWith(renameButton.cloneNode(true));
    const newRenameButton = document.getElementById("renameButton");

    // Rename functionality
    newRenameButton.addEventListener("click", () => {
        if (newName.value.trim() !== "") {
            element.childNodes[0].textContent = newName.value;
        }

        renameBox[0].style.display = "none"; // Hide rename box after renaming

        // Re-enable all buttons once the rename box is closed
        enableAllButtons();
    });

    // Close the rename box when the close button is clicked
    closeButton.addEventListener("click", () => {
        renameBox[0].style.display = "none";

        // Re-enable all buttons once the rename box is closed
        enableAllButtons();
    });
}

// Function to move a task to another list
function moveTask(taskElement) {
    const listElements = document.querySelectorAll(".listContainer");
    moveBox[0].style.display = "block";

    // Disable all buttons except those inside the move box
    disableAllButtonsExcept(moveBox[0]);

    const newBoxInput = document.getElementById("newBoxInput");
    const moveButton = document.getElementById("moveButton");

    // Clear any existing event listener before adding new ones
    moveButton.replaceWith(moveButton.cloneNode(true));
    const newMoveButton = document.getElementById("moveButton");

    newMoveButton.addEventListener("click", () => {
        let taskMoved = false;

        // Clone the task element
        const newTaskElement = taskElement.cloneNode(true);

        // Find the destination list
        listElements.forEach(element => {
            if (newBoxInput.value.toUpperCase() === element.childNodes[0].textContent.toUpperCase()) {
                element.insertBefore(newTaskElement, element.childNodes[1]);
                taskElement.remove(); // Remove the task from the current list
                taskMoved = true;
            }
        });

        if (!taskMoved) {
            newBoxInput.value = "";
            newBoxInput.placeholder = "No list found";
        } else {
            newBoxInput.value = "";
            moveBox[0].style.display = "none"; // Hide move box after moving

            // Re-enable all buttons once the move box is closed
            enableAllButtons();
        }
    });

    const closeButton = document.getElementById("closeButton2");

    // Close the move box when the close button is clicked
    closeButton.addEventListener("click", () => {
        moveBox[0].style.display = "none";

        // Re-enable all buttons once the move box is closed
        enableAllButtons();
    });
}

// Function to delete a task
function deleteTask(taskElement) {
    taskElement.remove();
}

// Function to disable all buttons except those inside the given box
function disableAllButtonsExcept(box) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        if (!box.contains(button)) {
            button.disabled = true;
        }
    });
}

// Function to enable all buttons
function enableAllButtons() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = false;
    });
}