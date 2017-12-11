module.exports = function* tokenize(
	template,
	{
		open = '[',
		close = ']',
		escape = '\\',
	} = {}
) {
	const buffer = [];
	const STRING = 0;
	const VALUE = 1;
	let lastString = '';
	let state = STRING;
	template = [...template];
	if (open === close) {
		const mark = [...open];
		while (1) {
			if (mark.every(matches)) {
				consume(mark.length);
				if (state === STRING) {
					lastString = read();
					state = VALUE;
				} else {
					yield lastString;
					yield read().trim();
					state = STRING;
				}
			} else if (consumeOneChar()) {
				break;
			}
		}
	} else {
		open = [...open];
		close = [...close];
		while (1) {
			if (open.every(matches)) {
				if (state === VALUE) {
					lastString = `${lastString}${open}${read()}`;
				} else {
					lastString = read();
				}
				consume(open.length);
				state = VALUE;
				while (1) {
					if (close.every(matches)) {
						consume(close.length);
						yield lastString;
						yield read().trim();
						state = STRING;
						break;
					} else if (consumeOneChar()) {
						break;
					}
				}
			} else if (consumeOneChar()) {
				break;
			}
		}
	}
	if (state === VALUE) {
		yield `${lastString}${open}${read()}`;
	} else {
		yield read();
	}
	function read() {
		return buffer.splice(0, buffer.length).join('');
	}
	function matches(char, index) {
		return char === template[index];
	}
	function consume(length) {
		const chars = template.splice(0, length);
		if (chars[length - 1] === '\r' && template[0] === '\n') {
			chars.push(template.shift());
		}
		return chars.join('');
	}
	function consumeOneChar() {
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
};
