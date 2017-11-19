function parse(
	template,
	{
		open = '[',
		close = ']',
		escape = '\\',
	} = {}
) {
	const strings = [];
	const values = [];
	const buffer = [];
	const STRING = 0;
	const VALUE = 1;
	let state = STRING;
	let line = 1;
	let column = 0;
	template = [...template];
	if (open === close) {
		const mark = [...open];
		while (1) {
			if (mark.every(matches)) {
				consume(mark.length);
				clearBuffer();
				state = state === VALUE ? STRING : VALUE;
			} else if (consumeChar()) {
				break;
			}
		}
	} else {
		open = [...open];
		close = [...close];
		while (1) {
			if (open.every(matches)) {
				consume(open.length);
				if (state === VALUE) {
					throw error(`Unclosed ${open.join('')}`);
				}
				clearBuffer();
				state = VALUE;
			} else if (close.every(matches)) {
				consume(close.length);
				if (state === STRING) {
					throw error(`Invalid ${close.join('')}`);
				}
				clearBuffer();
				state = STRING;
			} else if (consumeChar()) {
				break;
			}
		}
	}
	if (state === VALUE) {
		throw error(`Unclosed ${open.join('')}`);
	}
	clearBuffer();
	return {strings, values};
	function matches(char, index) {
		return char === template[index];
	}
	function consume(length) {
		const chars = template.splice(0, length);
		if (chars[length - 1] === '\r' && template[0] === '\n') {
			chars.push(template.shift());
			length++;
		}
		for (let i = 0; i < length; i++) {
			switch (chars[i]) {
			case '\r':
				if (chars[i + 1] !== '\n') {
					line++;
					column = -1;
				}
				break;
			case '\n':
				line++;
				column = -1;
				break;
			default:
				column++;
			}
		}
		return chars.join('');
	}
	function consumeChar() {
		const char = consume(1);
		if (char === escape) {
			buffer.push(consume(1));
		} else if (char) {
			buffer.push(char);
		} else {
			return true;
		}
		return false;
	}
	function clearBuffer() {
		const string = buffer.splice(0, buffer.length).join('');
		if (state === STRING) {
			strings.push(string);
		} else {
			values.push(string.trim());
		}
	}
	function error(message) {
		return Object.assign(
			new SyntaxError(`${line}:${column} ${message}`),
			{
				line,
				column,
				message,
			}
		);
	}
}

module.exports = parse;
