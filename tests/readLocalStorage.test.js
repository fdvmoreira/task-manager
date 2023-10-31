/** @jest-environment jsdom */

import fs from "fs";
import path from "path";
import {JSDOM} from "jsdom";
import {afterEach,beforeEach,expect, describe, test} from "@jest/globals";

import { loadItems, storage } from "./../js/app";
import Item from "../js/item";

// const html = fs.readFileSync(path.resolve("./js/app.js"));
// const dom = new JSDOM(html);

/**
 * Read from local storage
 * @group ReadStorage
 */
describe("loadItems", ()=>{
	// setup
	beforeEach(()=>{
		storage.setItem("0",JSON.stringify({id:0,item:"test item",checked:false}));
	});
	// clear
	afterEach(()=>{
		storage.clear();
	});
	/**
	* @test {ReadStorage}
	*/
	test("should read NULL localStorage", ()=>{
		storage.clear();
		/** @type {Array.<Item>|null} */
		const items = loadItems(storage);
		if(!items) return;

		expect(items).toBeNull();
	});

	/**
	 * @test {ReadStorage}
	 */
	test("should read something from localStorage", ()=>{
		/** @type {Array.<Item>|null} */
		const items = loadItems(storage);
		if(!items) return;

		expect(items).not.toBeNull();
	});

	/**
	* @test {ReadStorage}
	*/
	test("shoul read the value with getters", ()=>{
		/** @type {Array.<Item>|null} */
		const items = loadItems(storage);
		if(!items) return;

		items.forEach(item=>{
			expect(item.id).toBe(0);
			expect(item.item).toBe("test item");
			expect(item.checked).toBeFalsy();
		});
	});
});
