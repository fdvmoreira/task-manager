export default class Item {
    #_id;
    #_item;
    #_checked;
    constructor(id, item, checked) {
        this.#_id = id;
        this.#_item = item;
        this.#_checked = checked;
    }

    set id(id) { this.#_id = id; }
    get id() { return this.#_id; }

    set item(item) { this.#_item = item; }
    get item() { return this.#_item; }

    set checked(checked) { this.#_checked = checked; }
    get checked() { return this.#_checked; }
}