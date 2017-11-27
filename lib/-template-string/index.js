const parse = require('../parse');
const compileString = require('../compile-string');
module.exports = class TemplateString {

	constructor(template, baseContext, options) {
		const parsed = parse(template, options);
		baseContext = baseContext || {};
		const keys = Object.keys(baseContext);
		return Object.assign(
			function generateString(context = {}) {
				for (const key of keys) {
					if (!(key in context)) {
						context[key] = baseContext[key];
					}
				}
				return compileString(parsed, context);
			},
			{baseContext},
			parsed
		);
	}

};
