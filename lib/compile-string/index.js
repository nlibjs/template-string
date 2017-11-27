const {runInNewContext} = require('vm');
module.exports = function compileString({strings, values}, context) {
	return `${strings[0]}${values.map((key, index) => {
		let value;
		if (key) {
			const name = `_${Date.now()}`;
			const ctx = Object.assign({
				[`context${name}`]: context,
			}, context);
			const code = [
				`${name} = ${key};`,
				`if (typeof ${name} === 'function') ${name} = ${name}(context${name});`,
			].join('\n');
			try {
				runInNewContext(code, ctx);
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
		return `${value}${strings[index + 1]}`;
	}).join('')}`;
};
