const assert = require('assert');
const test = require('@nlib/test');
const parse = require('../../lib/parse');

test('@nlib/template-string/parse', (test) => {

	[
		[
			[
				'',
			],
			[''],
			[],
		],
		[
			[
				'[foo]bar',
			],
			['', 'bar'],
			['foo'],
		],
		[
			[
				'[foo]bar[]',
			],
			['', 'bar', ''],
			['foo', ''],
		],
		[
			[
				'[foo]bar[][baz baz]  qux [ a b c  ]',
			],
			['', 'bar', '', '  qux ', ''],
			['foo', '', 'baz baz', 'a b c'],
		],
		[
			[
				'[foo]bar[][baz baz]  qux [ a b c  ] [\\[]',
			],
			['', 'bar', '', '  qux ', ' ', ''],
			['foo', '', 'baz baz', 'a b c', '['],
		],
		[
			[
				'open!fooclose!baropen!close!open!baz bazclose!  qux open! a b c  close! open!$[close!',
				{
					open: 'open!',
					close: 'close!',
					escape: '$',
				},
			],
			['', 'bar', '', '  qux ', ' ', ''],
			['foo', '', 'baz baz', 'a b c', '['],
		],
		[
			[
				'<value>foo</value>bar<value></value><value>baz baz</value>  qux <value> a b c  </value> <value>$[</value>',
				{
					open: '<value>',
					close: '</value>',
					escape: '$',
				},
			],
			['', 'bar', '', '  qux ', ' ', ''],
			['foo', '', 'baz baz', 'a b c', '['],
		],
		[
			[
				'\r\n\n]',
			],
			['\r\n\n]'],
			[],
		],
		[
			[
				'\r\n\n[    ',
			],
			['\r\n\n[    '],
			[],
		],
		[
			[
				'\r\n\n[[foo]',
			],
			['\r\n\n[', ''],
			['foo'],
		],
	]
	.forEach(([args, expectedStrings, expectedValues]) => {
		test(JSON.stringify(args), (test) => {
			const {strings, values} = parse(...args);
			test(`strings: ${strings.join(',')}`, () => {
				assert.deepEqual(strings, expectedStrings);
			});
			test(`values: ${values.join(',')}`, () => {
				assert.deepEqual(values, expectedValues);
			});
		});
	});

});
