const assert = require('assert');
const test = require('@nlib/test');
const parse = require('../../lib/parse');

test('@nlib/template-string/parse', (test) => {

	test('valid', (test) => {
		test('no values', (test) => {
			const source = '';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = [''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = [];
				assert.deepEqual(values, expected);
			});
		});

		test('1 value', (test) => {
			const source = '[foo]bar';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar'];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo'];
				assert.deepEqual(values, expected);
			});
		});

		test('empty key', (test) => {
			const source = '[foo]bar[]';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', ''];
				assert.deepEqual(values, expected);
			});
		});

		test('key with spaces', (test) => {
			const source = '[foo]bar[][baz baz]';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', '', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', '', 'baz baz'];
				assert.deepEqual(values, expected);
			});
		});

		test('trim spaces at both ends', (test) => {
			const source = '[foo]bar[][baz baz]  qux [ a b c  ]';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', '', '  qux ', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', '', 'baz baz', 'a b c'];
				assert.deepEqual(values, expected);
			});
		});

		test('key with escape', (test) => {
			const source = '[foo]bar[][baz baz]  qux [ a b c  ] [\\[]';
			const {strings, values} = parse(source);
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', '', '  qux ', ' ', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', '', 'baz baz', 'a b c', '['];
				assert.deepEqual(values, expected);
			});
		});

		test('custom marks: open!, close!', (test) => {
			const source = 'open!fooclose!baropen!close!open!baz bazclose!  qux open! a b c  close! open!$[close!';
			const {strings, values} = parse(source, {
				open: 'open!',
				close: 'close!',
				escape: '$',
			});
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', '', '  qux ', ' ', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', '', 'baz baz', 'a b c', '['];
				assert.deepEqual(values, expected);
			});
		});

		test('custom marks: <value>, </value>', (test) => {
			const source = '<value>foo</value>bar<value></value><value>baz baz</value>  qux <value> a b c  </value> <value>$[</value>';
			const {strings, values} = parse(source, {
				open: '<value>',
				close: '</value>',
				escape: '$',
			});
			test(`strings: ${strings.join(',')}`, () => {
				const expected = ['', 'bar', '', '  qux ', ' ', ''];
				assert.deepEqual(strings, expected);
			});
			test(`values: ${values.join(',')}`, () => {
				const expected = ['foo', '', 'baz baz', 'a b c', '['];
				assert.deepEqual(values, expected);
			});
		});
	});

	test('invalid', (test) => {
		test('Invalid ]', (test) => {
			const source = '\r\n\n]';
			let error;
			try {
				parse(source);
			} catch (err) {
				error = err;
			}
			test(`error.line: ${error.line}`, () => {
				assert.equal(error.line, 3);
			});
			test(`error.column: ${error.column}`, () => {
				assert.equal(error.column, 0);
			});
			test(`error.message: ${error.message}`, () => {
				assert.equal(error.message, 'Invalid ]');
			});
		});
		test('Unclosed [ at end', (test) => {
			const source = '\r\n\n[   ';
			let error;
			try {
				parse(source);
			} catch (err) {
				error = err;
			}
			test(`error.line: ${error.line}`, () => {
				assert.equal(error.line, 3);
			});
			test(`error.column: ${error.column}`, () => {
				assert.equal(error.column, 4);
			});
			test(`error.message: ${error.message}`, () => {
				assert.equal(error.message, 'Unclosed [');
			});
		});
		test('Unclosed [ at another [', (test) => {
			const source = '\r\n\n[[foo]';
			let error;
			try {
				parse(source);
			} catch (err) {
				error = err;
			}
			test(`error.line: ${error.line}`, () => {
				assert.equal(error.line, 3);
			});
			test(`error.column: ${error.column}`, () => {
				assert.equal(error.column, 1);
			});
			test(`error.message: ${error.message}`, () => {
				assert.equal(error.message, 'Unclosed [');
			});
		});
	});

});
