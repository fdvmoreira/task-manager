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
//[] Save the state of complete tasks
//[] implement removal and completion notification
//[] @fix - remove the setTimeOut function and find another implementation (Promise) to complete a task before moving the next one
//[] Move/archive completed tasks

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

/* *
* Set event handler for when the form is submitted - press ENTER or click the button 
*/
form.onsubmit = () => {
    const text = getInputText();
    inputTextField.value = "";
    if (text.trim().length > 0) {
        const item = createNewTask(text.trim(SEPARATOR));

        const task = new Item(tasks.length, item.childNodes[1].textContent, false)
        // Pass index and task, so that we have the keys to retrieve item from storage
        let itemWasSaved = saveItem(task);

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
 * Get the text from input field
 * @returns text: string
 */
const getInputText = () => inputTextField.value.toString();

/**
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
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode("" + text));
    li.appendChild(deleteBtn);
    return li;
}

/**
 * @param {Item} item - the object to be added to local storage, format "[index]-[text]" 
 * @returns Boolean True if the item added to storage and false otherwise
 */
const saveItem = (itemObj) => {
    try {
        localStorage[itemObj.id] = JSON.stringify(itemObj);
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

/**
 * Load the data from storage and fill the tasks array
 * @returns the items stored in local storage
 */
const loadItems = () => {
    let items = [];
    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.getItem(i.toString()));
    }
    // flatten the array to remove empty items
    items = items.flat();
    items.forEach((value, index) => {
        const newItem = JSON.parse(value);
        newItem._id = index;
        items[index] = JSON.stringify(newItem);
        console.log("Loading ... " + items[index]); // Remove me
    });

    return items;
}


/**
 * Update the elements on the page
 */
const updateUI = () => {

    // add new elements
    if (tasks.length !== 0) {
        tasks.forEach((value, index) => {
            const task = JSON.parse(value);
            const newItem = createNewTask(task._item);

            if (task._checked) {
                markItemAsComplete(newItem, "green");
            }
            unorderedListElement.appendChild(newItem);
        });
    }
    addEventHandlerToButtons();
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
 * Change the appearence of the checkbox and text to simulate a complete task
 * @param {HTMLElement} element - the element to change get the background color changed
 * @param {String} bgcolor - the color to apply to element's background
 */
const markItemAsComplete = (element, bgcolor) => {
    element.childNodes[0].style.backgroundColor = bgcolor;
    element.className = "strike-through";
}

/**
 * Unmark the item from the list
 * @param {HTMLElement} element the element to be unmarked
 */
const unmarkListItem = (element) => {
    element.childNodes[0].style.backgroundColor = "";
    element.className = "";
}

/**
 * Delete element at index from the list
 * @param {Number} index index of the element to be removed
 * @returns void
 */
const deleteItemFromList = (index) => {
    const deletedItem = tasks.splice(index, 1);
    if (deletedItem.length === 0) {
        console.error("index:" + index + " Error: Item was not removed!");
        return;
    }
    console.log("index:" + index + " Item removed from list.");
    // TODO delete single item from storage and
    tasks = tasks.flat();
    localStorage.clear();
    tasks.forEach((task, id) => {
        let item = JSON.parse(task);
        saveItem(new Item(id, item._item, item._checked));
        // localStorage.setItem(id.toString(), task);
    });
    cleanupUI();
    updateUI();
}

/**
 * update the status of item
 * @param {Number} index of the array 
 * @param {Boolean} done if an item is complete or not
 */
const updateItemStatus = (index, done) => {
    tasks = tasks.flat();
    console.log("index: " + index + " task " + tasks[index]);
    let newItem = JSON.parse(tasks[index]);
    newItem._checked = done;
    tasks[index] = JSON.stringify(newItem); // update array
    saveItem(new Item(index, newItem._item, newItem._checked)); //update localstorage
}

/**
 * Checks if an item has been marked as complete
 * @param {HTMLElement} listItem list item to check
 * @returns true or false
 */
const isChecked = (element) => element.childNodes[INDEX_CHECKBOX].style.backgroundColor.length > 0;

/**
 * Add the event handler to the complete and delete buttons
 */
const addEventHandlerToButtons = () => {
    let listItems = document.querySelector("#taskList").children;
    console.log(listItems);
    for (let newItem of listItems) {
        const checkbox = newItem.childNodes[INDEX_CHECKBOX];
        const deleteBtn = newItem.childNodes[INDEX_DELETE_ITEM];

        // check the box
        checkbox.addEventListener("click", () => {
            let index = Array.from(checkbox.parentElement.parentElement.children).indexOf(checkbox.parentElement);
            if (!isChecked(newItem)) {
                updateItemStatus(index, true);
                markItemAsComplete(newItem, "green");
                return
            }
            updateItemStatus(index, false);
            unmarkListItem(newItem);
        });

        // delete item from list
        deleteBtn.addEventListener("click", () => {
            let elIndex = Array.from(deleteBtn.parentElement.parentElement.children).indexOf(deleteBtn.parentElement);
            console.log("li index " + elIndex);
            deleteItemFromList(elIndex);
        });
    }
}