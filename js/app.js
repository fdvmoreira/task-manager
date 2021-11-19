/** Task Manager */

// TODO 

//[*] get input text
//[*] create new item element
//[*] save it to local storage
//[*] load data from storage
//[*] update the UI
//[*] @fixup -  Load data automatically if they are stored in the storage
//[] @issue - Items not being displayed
//[] Implement clickable task item
//[] @fixup - When reloading the page if items are saved the first added will replace the intem at index 0
//[] @fix - remove the setTimeOut function and find another implementation (Promise) to complete a task before moving the next one

const inputTextField = document.querySelector("#inputText");
const list = document.querySelector("#taskList")
const form = document.querySelector("#inputForm");

let tasks = [];
const SEPARATOR = '-';

/** Load the data */
window.onload = (env) => {
    if (localStorage.length > 0) {
        tasks = loadItems();
        updateUI();
    }
}

/* * Set event handler for when the form is submitted - press ENTER or click the button */
form.onsubmit = (event) => {

    // event.preventDefault();

    const text = getInputText();
    inputTextField.value = "";
    if (text.trim().length > 0) {
        const item = createNewTask(text.trim(SEPARATOR));

        // Pass index and task, so that we have the keys to retrieve item from storage
        let wasSaved = saveItem(tasks.length + SEPARATOR + item.childNodes[0].textContent);

        if (!wasSaved) {
            console.error("Your item was not saved to local storage.");
            return;
        }
        // Load items into tasks array
        tasks = loadItems();

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
    li.appendChild(document.createTextNode(text));
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
        return null;
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

    cleanupUI();
        // add new elements
    if (tasks.length !== 0) {
        tasks.forEach((value) => {
            list.appendChild(createNewTask(value));
        });
    }
    
}

/**
 * Clean the UI 
 * The timer help slowing down the DOM because it was slow -
 * cleaning the old elements before adding new ones
 */
 const cleanupUI = () => {
    for (const el of list.children) {
        setTimeout(() => {
            const removedEl = list.removeChild(el);
        }, 100);
    }
} 
