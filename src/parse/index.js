const tokenize = require('../tokenize');
module.exports = function parse(template, marks) {
	const strings = [];
	const values = [];
	let count = 0;
	for (const string of tokenize(template, marks)) {
		(++count % 2 ? strings : values).push(string);
	}
	return {
		strings,
		values,
	};
};
