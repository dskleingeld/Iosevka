"use strict";

const Parameters = require("./parameters");

module.exports = function applyLigationData(data, para, argv) {
	const optInBuildup = {};
	const optOutBuildup = {};

	const hives = {};
	hives["default"] = { caltBuildup: [] };
	for (const gr in data.simple) {
		hives[gr] = { appends: { caltBuildup: [data.simple[gr].ligGroup] } };
	}
	for (const gr in data.composite) {
		const comp = data.composite[gr];
		if (!comp.tag) continue;

		const ligSets = createBuildup(data.simple, comp.buildup);
		if (comp.isOptOut) {
			optOutBuildup[comp.tag] = ligSets;
		} else {
			optInBuildup[comp.tag] = ligSets;
		}
		if (!comp.isOptOut) {
			hives[gr] = { caltBuildup: ligSets };
		}
	}

	para.ligation = {
		defaultBuildup: { ...optInBuildup, ...optOutBuildup },
		caltBuildup: []
	};
	if (argv.ligationBuildup) Parameters.apply(para.ligation, hives, [argv.ligationBuildup]);
};

function createBuildup(simple, buildup) {
	let ligSet = new Set();
	for (const s of buildup) {
		if (!simple[s]) throw new Error("Cannot find simple ligation group " + s);
		ligSet.add(simple[s].ligGroup);
	}
	return Array.from(ligSet);
}
