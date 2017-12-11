const {runInNewContext} = require('vm');
module.exports = function getValue(context, key) {
	let value;
	if (key) {
		const name = `_${Date.now()}`;
		const ctx = Object.assign({
			[`context${name}`]: context,
		}, context);
		try {
			runInNewContext(`${name} = ${key};`, ctx);
			value = ctx[name];
		} catch (error) {
			if (!error.toString().startsWith('ReferenceError')) {
				throw error;
			}
		}
		if (typeof value === 'function') {
			value = value(context);
		}
	} else {
		value = context[key];
	}
	return `${value}`;
};
