const assert = require('assert');
const console = require('console');
const parse = require('../../src/parse');

const tests = [
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
			'\r\n\n[[[foo]',
		],
		['\r\n\n', ''],
		['[[foo'],
	],
];

for (const [args, expectedStrings, expectedValues] of tests) {
	const {strings, values} = parse(...args);
	assert.deepEqual(strings, expectedStrings);
	assert.deepEqual(values, expectedValues);
}
console.log('passed: parse');
