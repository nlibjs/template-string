const {StringDecoder} = require('string_decoder');
const {Transform} = require('stream');
const tokenize = require('../tokenize');
const getString = require('../get-string');

module.exports = class TemplateStringTransformer extends Transform {

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
		this.consume([...this.decoder.write(chunk)], callback);
	}

	consume(chars, callback) {
		while (0 < chars.length) {
			const char = chars.shift();
			switch (char) {
			case '\r':
			case '\n':
				return this.flush()
				.then(() => {
					this.push(char);
					this.consume(chars, callback);
				})
				.catch(callback);
			default:
				this.chars.push(char);
			}
		}
		callback();
		return Promise.resolve();
	}

	_flush(callback) {
		this.flush()
		.then(() => {
			callback();
		})
		.catch(callback);
	}

	flush() {
		const {context, chars, marks} = this;
		this.chars = [];
		const parser = tokenize(chars, marks);
		this.push(parser.next().value);
		const next = () => {
			const {value, done} = parser.next();
			if (done) {
				return Promise.resolve();
			}
			return Promise.resolve(getString(context, value))
			.then((string) => {
				this.push(string);
				this.push(parser.next().value);
				return next();
			});
		};
		return next();
	}

};
