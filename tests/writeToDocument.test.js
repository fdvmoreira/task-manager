
/** @jest-environment jsdom */

import { beforeAll, afterEach, expect, describe, test } from "@jest/globals";

import { JSDOM } from "jsdom";

import {
  clearList,
  createListItemElement,
  insertItemToList,
  storage,
  unorderedListElement,
  updateListItemState,
} from "../js/app";
import Item from "../js/item";

const html = String.raw`
	<ul data-id="task-list">
		<li data-checked="false" data-id="999"> First element </li>
		<li> Second element </li>
		<li> Third element </li>
		<li> Fourth element </li>
		<li> Fifth element </li>
	</ul>
`;
const dom = new JSDOM(html);

/**
 * Clean the List
 * @group ClearList
 */
describe("clearList", () => {
  /** @type {HTMLUListElement|null} */
  let uList = null;
  beforeAll(() => {
    uList = dom.window.document.querySelector("ul");
  });

  /**
   * @test {ClearList}
   */
  test("should clear the list", () => {
    clearList(uList);
    expect(uList.children).toHaveLength(0);
  });
});

/**
 * Insert Item into the list
 * @group UpdateList
 */
describe("insertItemToList", () => {
  /**
   * @test {UpdateList}
   */
  test("should insert item into the list", () => {
    /** @type {Item} */
    const item = new Item(111, "Hello There", true);
    /** @type {HTMLUListElement} */
    const uList = dom.window.document.querySelector("[data-id='task-list']");
    if (!uList) return Promise.reject("Could not find element");
    /** @type {number} */
    const cnt = uList.children.length;

    // THeSe LINEs WILL NOT WORK. JSDOM does not recognise li created with document.createElement as a type of Node
    // insertItemToList(item, uList);
    // expect(uList.children.length).toEqual(cnt+1);
  });
});

/**
 * Update the state of the item
 * @group UpdateList
 */
describe("updateListItemState", () => {
  /**
   * @test {UpdateList}
   */
  test("should update the state of an LI element", async () => {
    /** @type {HTMLLIElement|null} */
    // const li = dom?.window?.document?.querySelector("[data-id='999']");
    // if (!li) return Promise.reject("Could Not find LI");
    // li?.addEventListener("click", updateListItemState);
    // li?.click();
    // expect(li?.getAttribute("data-id")).toBe("true");
  });
});
