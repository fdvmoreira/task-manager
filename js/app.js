/** Task Manager */

// TODO 

//[*] get input text
//[*] create new item element
//[*] save it to local storage
//[*] load data from storage
//[*] update the UI
//[*] @fixup -  Load data automatically if they are stored in the storage
//[*] @issue - Items not being displayed
//[*] Implement clickable task item
//[*] delete item from the list
//[*] @fixup - When reloading the page if items are saved the first added will replace the intem at index 0
//[] @fix - remove the setTimeOut function and find another implementation (Promise) to complete a task before moving the next one
//[] Save the state of complete tasks
//[] Move/archive completed tasks
//[] implement removal and completion notification


import Item from "./item.js";

const inputTextField = document.querySelector("#inputText");
const unorderedListElement = document.querySelector("#taskList")
const form = document.querySelector("#inputForm");

let tasks = [];
const SEPARATOR = '-';

const INDEX_CHECKBOX = 0;
const INDEX_DELETE_ITEM = 2;

/** Load the data */
window.onload = (env) => {
    if (localStorage.length > 0) {
        tasks = loadItems();
        updateUI();
    }
}



/* * Set event handler for when the form is submitted - press ENTER or click the button */
form.onsubmit = (event) => {

    const text = getInputText();
    inputTextField.value = "";
    if (text.trim().length > 0) {
        const item = createNewTask(text.trim(SEPARATOR));

        // Pass index and task, so that we have the keys to retrieve item from storage
        let itemWasSaved = saveItem(tasks.length + SEPARATOR + item.childNodes[1].textContent);

        if (!itemWasSaved) {
            console.error("Your item was not saved to local storage.");
            return;
        }
        // Load items into tasks array
        tasks = loadItems();

        // Clean up the UI
        cleanupUI();

        // Update the UI
        updateUI();


    }
}

/**
 * 
 * Get the text from input field
 * @returns text: string
 */
const getInputText = () => inputTextField.value.toString();

/**
 * 
 * Create new item
 * @param text - text string to be added to the list 
 * @returns newly created item
 */
const createNewTask = (text) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("span");
    checkbox.className = "checkbox";
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "delete";
    // span.setAttribute("class", "checkbox");
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + text));
    li.appendChild(deleteBtn);
    return li;
}

/**
 * 
 * @param {String} item - the text to be added to local storage, format "[index]-[text]" 
 * @returns Boolean True if the item added to storage and false otherwise
 */
const saveItem = (item) => {
    let [key, ...value] = item.split(SEPARATOR);

    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

/**
 * 
 * Load the data from storage and fill the tasks array
 * @returns the items stored in local storage
 */
const loadItems = () => {
    let items = [];

    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.getItem(i.toString(10)));
    }

    // flatten the array to remove empty items
    return items.flat();
}


/**
 * Update the elements on the page
 */
const updateUI = () => {

    // add new elements
    if (tasks.length !== 0) {
        tasks.forEach((value) => {
            unorderedListElement.appendChild(createNewTask(value));
        });
        addClickEventBehaviourToListItems();
    }
}

/**
 * Clean the UI 
 * The timer help slowing down the DOM because it was slow -
 * cleaning the old elements before adding new ones
 */
const cleanupUI = () => {
    for (const element of unorderedListElement.children) {
        setTimeout(() => {
            const removedEl = unorderedListElement.removeChild(element);
        }, 10);
    }
}

/**
 * Add click event to item to mark them as complete or not
 */
const addClickEventBehaviourToListItems = () => {
    let listOfItems = document.querySelectorAll("li");
    listOfItems.forEach((listItem, index) => {
        const checkbox = listItem.childNodes[INDEX_CHECKBOX];
        const deleteBtn = listItem.childNodes[INDEX_DELETE_ITEM];
        // mark item as complete
        checkbox.addEventListener("click", () => {
            let bgcolor = listItem.childNodes[INDEX_CHECKBOX].style.backgroundColor;
            markItemAsComplete(listItem.childNodes[INDEX_CHECKBOX], bgcolor);

        });
        // delete item from list
        deleteBtn.addEventListener("click", () => {
            let elIndex = Array.from(deleteBtn.parentElement.parentElement.children).indexOf(deleteBtn.parentElement);
            console.log("li index " + elIndex);
            deleteItemFromList(elIndex);
        });
    });
}

/**
 * Change the appearence of the checkbox and text to simulate a complete task
 * @param {HTMLElement} element - the element to change get the background color changed
 * @param {String} bgcolor - the color to apply to element's background
 */
const markItemAsComplete = (element, bgcolor) => {
    element.style.backgroundColor = ((bgcolor.length > 0) ? (() => {
        element.parentElement.className = "";
        return "";
    })() : (() => {
        element.parentElement.className = "strike-through";
        return "green";
    })());

}

/**
 * Delete element at index from the list
 * @param {Number} index index of the element to be removed
 * @returns void
 */
const deleteItemFromList = (index) => {
    const deleteItem = tasks.splice(index, 1);
    if (deleteItem.length === 0) {
        console.error("index:" + index + " Error: Item was not removed!");
        return;
    }
    console.log("index:" + index + " Item removed from list.");
    tasks = tasks.flat();
    localStorage.clear();
    tasks.forEach((task, id) => {
        localStorage.setItem(id.toString(), task);
    });
    cleanupUI();
    updateUI();
}
