const assert = require('assert');
const test = require('@nlib/test');
const {TemplateString} = require('../..');

test('TemplateString', (test) => {

	[
		[
			[' [foo] [[bar + 1]] baz '],
			[
				[{foo: 1, bar: 2}, ' 1 [3] baz '],
				[
					{
						foo({baz}) {
							return baz * 3;
						},
						bar: -5,
						baz: -1,
					},
					' -3 [-4] baz ',
				],
			],
		],
		[
			[
				' <value>foo.foo</value> </value>[bar]<value> baz</value> </value>',
				{},
				{
					open: '<value>',
					close: '</value>',
				},
			],
			[
				[{foo: {foo: 1}, bar: 2}, ' 1 </value>[bar]undefined </value>'],
				[
					{
						foo: {
							foo({baz}) {
								return baz * 3;
							},
						},
						bar({baz}) {
							return baz * 4;
						},
						baz: -1,
					},
					' -3 </value>[bar]-1 </value>',
				],
			],
		],
		[
			[
				' $foo$ $$ $$$',
				{foo: 'bar'},
				{
					open: '$',
					close: '$',
				},
			],
			[
				[{}, ' bar undefined undefined$'],
				[{'': 'baz'}, ' bar baz baz$'],
			],
		],
	]
	.forEach(([args, tests]) => {
		test(JSON.stringify(args), (test) => {
			const generate = new TemplateString(...args);
			tests
			.forEach(([context, expected]) => {
				test(`${JSON.stringify(context)} → ${JSON.stringify(expected)}`, () => {
					const actual = generate(context);
					assert.equal(actual, expected);
				});
			});
		});
	});

});
