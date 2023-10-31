//@ts-check

/** @module Item */

/**
 * Defines individual items in the list
 */
export default class Item {

    /**
     * Create the item object
     * @param {!number} id
     * @param {!string} item
     * @param {!boolean} checked
     */
    constructor(id, item, checked) {
        /** @private */
        this._id = id;
        
        /** @private */
        this._item = item;
        
        /** @private */
        this._checked = checked;
    }

    /**
    * Set the id
    * @param {!number} id - the new id for this object
    */
    set id(id) { this._id = id; }

    /**
    * Get the id
    * @return {number} the object id
    */
    get id() { return this._id; }

    /**
    * Set the item text
    * @param {!string} item - the text description
    */
    set item(item) { this._item = item; }

    /**
    * Get the item text
    * @return {string}
    */
    get item() { return this._item; }

    /**
    * Check the item
    * @param {!boolean} checked - the state of the item
    */
    set checked(checked) { this._checked = checked; }

    /**
    * Get the state of the item
    * @return {boolean} - The state of the item
    */
    get checked() { return this._checked; }
}
