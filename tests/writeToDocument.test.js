/** @jest-environment jsdom */

import {beforeAll, afterEach, expect, describe, test} from "@jest/globals";

import fs from "fs";
import path from "path";
import {JSDOM} from "jsdom";

import { clearList } from "../js/app";

const html = String.raw`
	<ul>
		<li> First element </li>
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
describe("clearList", ()=>{
	/** @type {HTMLUListElement|null} */
	let uList = null;
	beforeAll(()=>{
		uList = dom.window.document.querySelector("ul");
	});
	
	/**
	* @test {ClearList}
	*/
	test("should clear the list", ()=>{
		clearList(uList);
		expect(uList.children).toHaveLength(0);
	});
});
