
/** Task Manager */

// TODO 

//[*] get input text
//[*] create new item element
//[*] save it to local storage
//[*] load data from storage
//[] update the UI

const container = document.querySelector('.container');
const inputTextField = document.querySelector("#inputText");
const btnAddToList = document.querySelector("#btnAddToList");
const list = document.querySelector("#taskList")

const form = document.querySelector("#inputForm");

let tasks = [];
const separator = '-';

/* * Set event handler for when the form is submitted - press ENTER or click the button */
form.onsubmit = (event) => {

    // event.preventDefault();

    const text = getInputText();
    inputTextField.value = "";
    if (text.trim().length > 0) {
        const item = createNewTask(text.trim(separator));

        // Pass index and task, so that we have the keys to retrieve item from storage
        let wasSaved = saveItem(tasks.length+separator+item.childNodes[0].textContent);
        
        if(!wasSaved){
            console.error("Your item was not saved to local storage.");
            return;
        }
        // Load items into tasks
        tasks = loadItems();
        
        if(tasks.length !== 0){
            console.log(tasks.length+" tasks found! : "+tasks);
        }
        
        // Update the UI
        updateUI();


    }
    /*
    let data = saveItem(item);
    updateUI(data); */
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
 * @param {String} item - the text to be added to local storage, format "<index>-<text>" 
 * @returns Boolean True if the item added to storage and false otherwise
 */
const saveItem = (item)=>{
    let [key,...value] = item.split(separator);

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
const loadItems = ()=>{
    let items = [];

    for(let i = 0; i < localStorage.length; i++ ){
        items.push(localStorage.getItem(i.toString(10)));
    }

    // flatten the array to remove empty items
    return items.flat();
}



/**
 * Update the elements on the page
 */
const updateUI = async ()=>{
    
    // TODO fix removal issues with index
    // TODO Create a promise to remove item from DOM properly
    
    // clean the UI
    for(let i of list.children){
        let rmd = list.removeChild(i);
        console.log(`Item ${rmd.textContent} removed : `);
    }
    
    // add new elements
    if(tasks.length !== 0){
        tasks.forEach((value, index, arr)=>{
            list.appendChild(createNewTask(value));
            console.log("Elements in the DOM : "+list.childElementCount);
        });
    }
}

