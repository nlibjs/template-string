module.exports = function compileString({strings, values}, context) {
	return `${strings[0]}${values.map((key, index) => {
		let value = context[key];
		if (typeof value === 'function') {
			value = value(context);
		}
		return `${value}${strings[index + 1]}`;
	}).join('')}`;
};
