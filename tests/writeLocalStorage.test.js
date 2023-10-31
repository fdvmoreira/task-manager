/** @jest-environment jsdom */

import {expect, test, describe} from "@jest/globals";

import { saveItem, storage } from "../js/app";

/**
 * Save Item to Local Storage
 * @group SaveItem
 */
describe("saveItem", ()=>{
	/**
	* @test {SaveItem}
	*/
	test("should increment the number of items in the storage storage", ()=>{
		/** @type {number} */
		const storageLength = storage.length;

		/** @type {import("../js/app").ItemObj} */
		const objStr = {id:999, item:"Item 999", checked:true};

		/** @type {Item|null} */
		const savedItem = saveItem(objStr.id, JSON.stringify(objStr),storage);

		expect(storage).toHaveLength(storageLength + 1);
		expect(savedItem).not.toBeNull();
	});
});



