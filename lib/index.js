/* eslint-disable prefer-arrow-callback */
const parse = require('./parse');

class TemplateString {

	constructor(template, baseContext, parseOptions) {
		const {strings, values} = parse(template, parseOptions);
		baseContext = baseContext || {};
		const keys = Object.keys(baseContext);
		return Object.assign(
			function generateString(context) {
				for (const key of keys) {
					if (!(key in context)) {
						context[key] = baseContext[key];
					}
				}
				return `${strings[0]}${values.map((key, index) => {
					let value = context[key];
					if (typeof value === 'function') {
						value = value(context);
					}
					return `${value}${strings[index + 1]}`;
				}).join('')}`;
			},
			{
				baseContext,
				strings,
				values,
			}
		);
	}

}

module.exports = TemplateString;
