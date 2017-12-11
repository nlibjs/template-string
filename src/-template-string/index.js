const parse = require('../parse');
const getString = require('../get-string');

module.exports = class TemplateString {

	constructor(template, baseContext, options = {}) {
		const {strings, values} = parse(template, options);
		baseContext = baseContext || {};
		const keys = Object.keys(baseContext);
		return Object.assign(
			(context = {}) => {
				for (const key of keys) {
					if (!(key in context)) {
						context[key] = baseContext[key];
					}
				}
				return `${strings[0]}${values.map((key, index) => {
					return `${getString(context, key)}${strings[index + 1]}`;
				}).join('')}`;
			},
			{baseContext, strings, values}
		);
	}

};
