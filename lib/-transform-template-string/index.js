const {StringDecoder} = require('string_decoder');
const {Transform} = require('stream');
const parse = require('../parse');
const compileString = require('../compile-string');

module.exports = class TransformTemplateString extends Transform {

	constructor(
		context,
		{
			open = '[',
			close = ']',
			encoding = 'utf8',
			escape = '\\',
		} = {}
	) {
		Object.assign(
			super(),
			{
				context,
				decoder: new StringDecoder(encoding),
				chars: [],
				marks: {
					open,
					close,
					escape,
				},
			}
		);
	}

	_transform(chunk, encoding, callback) {
		for (const char of this.decoder.write(chunk)) {
			switch (char) {
			case '\r':
			case '\n':
				this.push(this.flush());
				this.push(char);
				break;
			default:
				this.chars.push(char);
			}
		}
		callback();
	}

	_flush(callback) {
		this.push(this.flush());
		callback();
	}

	flush() {
		const {chars, marks} = this;
		this.chars = [];
		return compileString(parse(chars, marks), this.context);
	}

};
