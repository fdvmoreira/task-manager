
/** @jest-environment jsdom */

import { expect, test, describe } from "@jest/globals";

import { saveItem, storage, updateLocalStorage } from "../js/app";
import Item from "../js/item";

/**
 * Save Item to Local Storage
 * @group SaveItem
 */
describe("saveItem", () => {
  /**
   * @test {SaveItem}
   */
  test("should increment the number of items in the storage storage", () => {
    /** @type {number} */
    const storageLength = storage.length;

    /** @type {import("../js/app").ItemObj} */
    const objStr = { id: 999, item: "Item 999", checked: true };

    /** @type {Item|null} */
    const savedItem = saveItem(objStr.id, JSON.stringify(objStr), storage);

    expect(storage).toHaveLength(storageLength + 1);
    expect(savedItem).not.toBeNull();
  });
});

/**
 * @group UpdateStorage
 */
describe("updateLocalStorage", () => {
  /**
   * @test {UpdateStorage}
   */
  test("should update local storage", () => {
    /** @type {Item} */
    const newItem = new Item(
      new Date().getTime().toString(),
      "hello there",
      false,
    );
    /** @type {string} */
    const key = newItem.id.toString();
    updateLocalStorage(key, newItem, storage);
    newItem.checked = true;
    updateLocalStorage(key, newItem, storage);
    expect(storage.getItem(key)).toMatch("true");
  });
});
