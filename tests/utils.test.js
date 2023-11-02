
/** @jest-environment jsdom */

import { describe, test, expect } from "@jest/globals";

import {
  InvalidItemInstanceObjectError,
  createListItemElement,
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
  test("should create an li element", () => {
    /** @type {Item} */
    const item = new Item(999, "New Item", false);
    /** @type {?HTMLLIElement} */
    const li = createListItemElement(item);
    expect(li.getAttribute("data-id")).toBe("999");
    expect(li.getAttribute("data-checked")).toBe("false");
    expect(li.textContent).toBe("New Item");
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
