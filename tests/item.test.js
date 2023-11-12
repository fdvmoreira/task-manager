/** @jest-environment jsdom */
// @ts-check

import {beforeEach, describe, test, expect} from "@jest/globals";

import Item from "../js/item";

/** @type {Item|null} */
let obj = null;

/**
	* Item class
	* @group Item
	*/ 
describe("Item", ()=>{

	beforeEach(()=>{
		obj = new Item(0,"Test Item", false);
	});

	/**
		* @test {Item}
		*/ 
	test("show create an Item object", ()=>{
		expect(obj).toBeInstanceOf(Item)
		expect(obj).toHaveProperty('id');
		expect(obj).toHaveProperty('item');
		expect(obj).toHaveProperty('checked');
	});

	/**
		* @test {Item}
		*/
	test("should set and get id", ()=>{
		if(!obj) return;
		obj.id = 99;
		expect(obj.id).toBe(99);
	});
	/**
		* @test {Item}
		*/
	test("should set and get item", ()=>{
		if(!obj) return;
		obj.item = "hakunamatata";
		expect(obj.item).toBe("hakunamatata");
	});
	/**
		* @test {Item}
		*/
	test("should set and get checked", ()=>{
		if(!obj) return;
		obj.checked = true;
		expect(obj.checked).toBeTruthy();
	});
});


