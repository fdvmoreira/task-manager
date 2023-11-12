
/** @jest-environment jsdom */

import { describe, test, expect } from "@jest/globals";

import {
  InvalidItemInstanceObjectError,
  createListItemElement,
  filterList,
  toggleBoolString,
} from "../js/app";

import Item from "../js/item";

/**
 * @group Utils
 */
describe("createListItemElement", () => {
  /**
   * @test {Utils}
   */
  test("shoul throw an InvalidItemInstanceObjectError exception", () => {
    /** @type {Item} */
    const item = new Item(9, "hello", null);
    expect(() => createListItemElement(item)).toThrowError(
      InvalidItemInstanceObjectError,
    );
  });

  /**
   * @test {Utils}
   */
  test("should create an LI element", () => {
    /** @type {Item} */
    const item = new Item(999, "New Item", false);
    /** @type {?HTMLLIElement} */
    const li = createListItemElement(item);

    expect(li.getAttribute("data-id")).toBe("999");
    expect(li.getAttribute("data-checked")).toBe("false");
    expect(li.children?.item(0).textContent).toBe("New Item");
  });
});

/**
 * @group Utils
 */
describe("toggleBooleanString", () => {
  /**
   * @test {Utils}
   */
  test("should return true", () => {
    expect(toggleBoolString("false")).toEqual("true");
  });
  /**
   * @test {Utils}
   */
  test("should return false", () => {
    expect(toggleBoolString("true")).toEqual("false");
  });
  /**
   * @test {Utils}
   */
  test("should return false", () => {
    expect(toggleBoolString("")).toEqual("false");
  });
});

/**
 * @group Utils
 */
describe("filterList", () => {
  /** @type {Array.<Item>} */
  let items = [false, true, true, false, false].map(
    (b) => new Item(new Date().getTime(), `Test Item${b}`, b),
  );

  /**
   * @test {Utils}
   */
  test("should return NULL", () => {
    expect(filterList()).toBeNull;
    expect(filterList("")).toBeNull;
    expect(filterList("", [])).toBeNull;
    expect(filterList("ACTIVE", [])).toBeNull;
    expect(filterList("ALL", [])).toBeNull;
    expect(filterList("COMPLETED", [])).toBeNull;
  });

  /**
   * @test {Utils}
   */
  test("should filter ACTIVE items", () => {
    let state = "ACTIVE";
    expect(filterList(state, items)).toHaveLength(3);
  });

  /**
   * @test {Utils}
   */
  test("should filter COMPLETED items", () => {
    let state = "completed";
    expect(filterList(state, items)).toHaveLength(2);
  });

  /**
   * @test {Utils}
   */
  test("should return all items passed as input", () => {
    expect(filterList("all", items)).toHaveLength(5);
  });
});
