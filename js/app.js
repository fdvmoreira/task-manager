
/** Task Manager */

const container = document.querySelector('.container');
const inputTextField = document.querySelector("#inputText");
const btnAddToList = document.querySelector("#btnAddToList");
const list = document.querySelector("#taskList")

const form = document.querySelector("#inputForm");

/* * Set event handler for when the form is submitted - press ENTER or click the button */
form.onsubmit = (event) => {

    event.preventDefault();

    const text = getInputText();
    inputTextField.value = "";
    if (text.trim().length > 0) {
        
        const item = createNewTask(text.trim());
        console.log("Item was " + item?.childNodes[0].textContent);
    }
    /*
    let data = saveItem(item);
    updateUI(data); */

};

// console.log("form");

// get text
// create new item element
// save it to local storage
// update the UI

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
    li.appendChild(document.createTextNode(text));
    return li;
}

const saveItem = (item)=>{
    try {
        // encode the item and store it the as key
        const _key = atob(item.textContent);
        localStorage.setItem(_key,item);
    } catch (error) {
        console.error(error);
        return null;
    }

    return item;
}

//console.log(inputTextField.getAttribute('value'));