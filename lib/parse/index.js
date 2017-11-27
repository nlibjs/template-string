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
	template = [...template];
	if (open === close) {
		const mark = [...open];
		while (1) {
			if (mark.every(matches)) {
				consume(mark.length);
				if (state === STRING) {
					strings.unshift(read());
					state = VALUE;
				} else {
					values.unshift(read().trim());
					state = STRING;
				}
			} else if (consumeChar()) {
				break;
			}
		}
	} else {
		open = [...open];
		close = [...close];
		while (1) {
			if (open.every(matches)) {
				if (state === VALUE) {
					strings[0] += `${read()}${consume(open.length)}`;
				} else {
					consume(open.length);
					strings.unshift(read());
				}
				state = VALUE;
			} else if (state === VALUE && close.every(matches)) {
				consume(close.length);
				values.unshift(read().trim());
				state = STRING;
			} else if (consumeChar()) {
				break;
			}
		}
	}
	if (state === VALUE) {
		strings[0] += `${open}${read()}`;
	} else {
		strings.unshift(read());
	}
	return {
		strings: strings.reverse(),
		values: values.reverse(),
	};
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
	function read() {
		return buffer.splice(0, buffer.length).join('');
	}
}

module.exports = parse;
