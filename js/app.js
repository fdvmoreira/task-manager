
//@ts-check

import Item from "./item.js";

/** @type {!HTMLInputElement|null} */
const inputTextField = document.querySelector("[data-id='input-text']");

/** @type {!HTMLUListElement|null} */
export const unorderedListElement = document.querySelector(
  "[data-id='task-list']",
);

/** @type {!HTMLFormElement|null} */
const form = document.querySelector("[data-id='input-form']");

/** @type {HTMLUListElement | null} */
const tabs = document.querySelector(".tabs .tab");

/**
 * Item object
 * @typedef {Object} ItemObj
 * @property {number} _id - the item id
 * @property {string} _item - the item text
 * @property {boolean} _checked - the state of the item
 */

/**
 * Load the item from localstorage on onload
 * @type {(_event:Event)=>void} onload
 */
window.onload = (_event) => {
  /** @type {!Array.<Item>|null} */
  const items = loadItems(localStorage);

  if (items && unorderedListElement) {
    renderList(items, unorderedListElement);
  }
};

/**
 * Handle form onsubmit event(create or update item)
 */
form?.addEventListener("submit", (env) => {
  env.preventDefault();
  if (!inputTextField) return;
  /** @type {string} */
  const value = inputTextField.value.trim();
  if (value.length === 0) return;
  /** @type {number} */
  const key = new Date().getTime();
  /** @type {Item} */
  const item = new Item(key, value, false);
  /** @type {Item|null} */
  const itemSaved = saveItem(key.toString(), JSON.stringify(item), storage);
  if (!itemSaved || !unorderedListElement) return;
  // ONLY add item to list if filter is COMPLETED is not set
  if (
    document.querySelector(".tab-item.selected")?.textContent?.toLowerCase() !==
    "completed"
  ) {
    insertItemToList(item, unorderedListElement);
  }
  // clear the text field
  inputTextField.value = "";
});

/**
 * Add listener to the tab items
 */
if (tabs?.children) {
  /** @type {number|undefined} */
  const numberOfTabs = tabs?.children?.length ?? 0;
  for (let i = 0; i < numberOfTabs; i++) {
    /** @type {HTMLLIElement|null} */
    const tabItem = /** @type {HTMLLIElement|null} */ (tabs?.children?.item(i));
    tabItem?.addEventListener("click", (event) => {
      event.stopPropagation();
      /** @type {HTMLLIElement|null} */
      const self = /** @type {HTMLLIElement} */ (event.currentTarget);
      // remove selected class from other items
      for (let y = 0; y < numberOfTabs; y++) {
        if (y !== i) tabs?.children?.item(y)?.classList.remove("selected");
      }
      // change the tab appearence
      self?.classList?.add("selected");
      /** @type {string} */
      const state = self?.textContent ?? "";
      /** @type {Array.<Item>|null} */
      let items = loadItems(localStorage);
      /** @type {Array.<Item>|null} */
      items = filterList(state, items);

      unorderedListElement && clearList(unorderedListElement);
      unorderedListElement && items && renderList(items, unorderedListElement);
    });
  }
}

/**
 * Filter the list of item based on state
 * @param {string} state - the state we want the list item
 * @param {Array.<Item>|null} items - the items to filter
 * @returns {Array.<Item>|null} filtered items
 *
 */
export function filterList(state, items) {
  if (state?.length === 0 || !state) return null;
  if (!items) return null;

  const states = {
    ACTIVE: "active",
    COMPLETED: "completed",
    ALL: "all",
  };

  /** @type {Array.<Item>|null} */
  let filteredItems = null;

  switch (state?.toLowerCase()) {
    case states.ALL:
      filteredItems = items;
      break;
    case states.ACTIVE:
      filteredItems = items.filter((item) => !item.checked);
      break;
    case states.COMPLETED:
      filteredItems = items.filter((item) => item.checked);
      break;
    default:
      return null;
  }

  return filteredItems;
}

/**
 * Load the items from the storage
 * @param {Storage} storage
 * @returns {Array.<Item>|null} An array of items objects or null
 */
export function loadItems(storage) {
  if (storage.length === 0) return null;
  const boolMap = { false: false, true: true };

  /** @type {Array.<string>} */
  let items = [];
  for (let i = 0; i < storage.length; i++) {
    /** @type {string|null} */
    const key = storage.key(i);
    if (!key) break;
    /** @type {string|null} */
    const item = storage.getItem(key);
    item && items.push(item);
  }
  return items.map((itemObjStr) => {
    /** @type {ItemObj} */
    const { _id, _item, _checked } = JSON.parse(itemObjStr);
    return new Item(_id, _item, boolMap[_checked]);
  });
}

/**
 * Render the list of items objects
 * @param {!Array.<Item>} items - the items array to be rendered
 * @param {!HTMLUListElement} uList - the location where the items should be rendered
 */
export function renderList(items, uList) {
  items.forEach((item) => {
    insertItemToList(item, uList);
  });
}

/**
 * Clean up the current item from the list
 * @param {!HTMLUListElement} uList - the list to be cleaned
 */
export function clearList(uList) {
  /** @type {NodeList} */
  uList.querySelectorAll("*").forEach((child) => {
    child.remove();
    //localStorage.clear();
  });
}

/**
 * Save Item to local storage
 * @param {!string} key - the key for the item
 * @param {!string} objStr - the stringfied object
 * @param {!Storage} storage - the local storage
 * @returns {Item|null} the item saved or null
 */
export function saveItem(key, objStr, storage) {
  if (key.length === 0 || objStr.length === 0 || !storage) return null;
  try {
    storage.setItem(key, objStr);
  } catch (error) {
    console.error(
      "QuotaExceededError: Check permissions or storage is localStorage is full",
    );
    return null;
  }
  /** @type {string|null} */
  const saved = storage.getItem(key);
  if (!saved) return null;
  const { _id, _item, _checked } = JSON.parse(saved);
  return new Item(_id, _item, _checked);
}

/**
 * Append item to list
 * @param {!Item} item - the item to add to the list
 * @param {!HTMLUListElement} uList - the list to insert the item into
 */
export function insertItemToList(item, uList) {
  try {
    /** @type {HTMLLIElement} */
    const li = createListItemElement(item);
    li.firstElementChild?.addEventListener("click", updateListItemState);
    uList?.appendChild(li); // This line does not work with JSDOM env.
  } catch (error) {
    console.log(error);
  }
}

/**
 * Callback for LI elements
 * @callback LiClickCallback
 * @param {MouseEvent} event - the event object
 * @param {Storage} storage - the localStorage
 */
export function updateListItemState(event, storage = localStorage) {
  /** @type {HTMLLIElement|null} */
  const li = /** @type {HTMLLIElement|null} */ (event.target.parentNode);

  li?.setAttribute(
    "data-checked",
    toggleBoolString(li?.getAttribute("data-checked") ?? ""),
  );

  /** @type {Object} */
  const obj = {
    key: li?.getAttribute("data-id"),
    checked: li?.getAttribute("data-checked"),
    text: li?.children?.item(0)?.textContent,
  };

  /** @type {Item} */
  const newItem = new Item(obj?.key, obj?.text, obj?.checked);
  updateLocalStorage(obj?.key, newItem, storage);

  // Hide the item from list if unchecked and tab open is complete
  if (
    li?.dataset?.checked === "false" &&
    document
      .querySelector(".tab-item.selected")
      ?.children.item(0)
      ?.textContent?.toLowerCase() === "completed"
  ) {
    li.remove();
  }
  // Hide the item from list if checked and tab is active
  if (
    li?.dataset?.checked === "true" &&
    document
      .querySelector(".tab-item.selected")
      ?.children.item(0)
      ?.textContent?.toLowerCase() === "active"
  ) {
    li.remove();
  }
}

/**
 * Delete the item from list
 * @param {HTMLLIElement} li - the item to be deleted
 */
export function deleteListItem(li) {
  li?.remove();
}

/**
 * Update the localstorage with the giver key
 * @param {string} key - the id of the item
 * @param {Item} newItem - the new content to save
 * @param {Storage} storage - the local storage (included for testing purposes)
 */
export function updateLocalStorage(key, newItem, storage) {
  try {
    storage.setItem(key, JSON.stringify(newItem));
  } catch (err) {
    console.log(err);
  }
}

/**
 * Delete Item from local Storage
 * @param {string} key - the item id to delete
 * @param {Storage} storage - the local storage
 */
export function deleteItemFromStorage(key, storage) {
  storage.removeItem(key);
}

/**
 * Create LI Element
 * @param {!Item} item
 * @returns {!HTMLLIElement} the created LI element
 * @throws {InvalidItemInstanceObjectError}
 */
export function createListItemElement(item) {
  if (Object.values(item).some((value) => value == undefined))
    throw new InvalidItemInstanceObjectError("Why??");
  /** @type {HTMLLIElement} */
  const li = document.createElement("li");
  li.dataset.id = item.id.toString();
  li.dataset.checked = String(item.checked);

  /** @type {HTMLSpanElement|null} */
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(item.item));
  li.appendChild(span);

  // Add a delete button each list item
  //
  /** @type {HTMLButtonElement|null} */
  const delBtn = document.createElement("button");
  delBtn.appendChild(document.createTextNode("delete"));
  delBtn?.addEventListener("click", (event) => {
    /** @type {HTMLLIElement|null} */
    const pli = /** @type {HTMLLIElement|null} */ (
      /** @type {HTMLButtonElement} */ (event.target)?.parentNode ?? null
    );
    /** @type {string|null} */
    const itemKey = pli?.getAttribute("data-id") ?? null;
    pli && deleteListItem(pli);
    itemKey && deleteItemFromStorage(itemKey, localStorage);
  });
  li.appendChild(delBtn);

  return li;
}

/**
 * Invalid Item Object Instance Error
 * @param {string} message - The message for the user
 * @param {Object} [additionalInfo={}] - extra info for the handler
 */
export function InvalidItemInstanceObjectError(message, additionalInfo) {
  Error.call(message);
  this.name = "InvalidItemInstanceObjectError";
  this.additionalInfo = additionalInfo;
}
Object.setPrototypeOf(InvalidItemInstanceObjectError, Error.prototype);

/**
 * Toggle Boolean String
 * @param {!string} value
 * @returns {string}
 */
export function toggleBoolString(value) {
  /** @type {Map} */
  const map = new Map([
    ["true", "false"],
    ["false", "true"],
  ]);
  if (!map.has(value)) return "false";
  return map.get(value);
}

/**
 * export localStorage for testing because the testing environment does not have access to localStorage API
 */
export const storage = localStorage;
