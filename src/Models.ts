/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./SyncNode.ts" />

"use strict"

namespace Models {

	export interface Db extends SyncNode.ISyncNode {
		employees: {[key: string]: Employee};
		//weeks: {[key: string]: Week};
		shifts: {[key: string]: Shift};
	}
	export interface Employee extends SyncNode.ISyncNode {
		key: string;
		name: string;
		phone: string;
		note: string;
	}
	export interface Week extends SyncNode.ISyncNode {
		key: string;
		shifts: {[key: string]: Shift};
	}
	export interface Shift extends SyncNode.ISyncNode {
		key: string;
		name: string;
		day: string;
		start: string;
		end: string;
		note: string;
	}

}
