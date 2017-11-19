require('./parse');
const assert = require('assert');
const test = require('@nlib/test');
const TemplateString = require('..');

test('@nlib/template-string', (test) => {

	test('function pattern', (test) => {
		const value = Date.now();
		const generate = new TemplateString('[c]', {value});
		let arg;
		const context = {
			c(a) {
				arg = a;
			},
		};
		generate(context);
		test('returns context object itself', () => {
			assert.equal(arg, context);
		});
		test('check value', () => {
			assert.equal(arg.value, value);
		});
	});

	test('valid', (test) => {
		[
			[
				'',
				[
					[null, ''],
				],
			],
			[
				'Hello [name]!',
				[
					[{name: 'foo'}, 'Hello foo!'],
					[{name: 'bar'}, 'Hello bar!'],
					[{}, 'Hello undefined!'],
				],
			],
			[
				'Hello <value>name</value>!',
				[
					[{name: 'foo'}, 'Hello foo!'],
					[{name: 'bar'}, 'Hello bar!'],
					[{}, 'Hello undefined!'],
				],
				null,
				{
					open: '<value>',
					close: '</value>',
				},
			],
			[
				'Hello $name$!',
				[
					[{name: 'foo'}, 'Hello foo!'],
					[{name: 'bar'}, 'Hello bar!'],
					[{}, 'Hello undefined!'],
				],
				null,
				{
					open: '$',
					close: '$',
				},
			],
			[
				'Hello [name] [a] [ b ]',
				[
					[{name: 'foo'}, 'Hello foo A B'],
					[{name: 'bar', b: 'C'}, 'Hello bar A C'],
					[
						{
							name: 'bar',
							b(context) {
								return `B${context.a}`;
							},
						},
						'Hello bar A BA',
					],
				],
				{
					a: 'A',
					b: 'B',
				},
			],
			[
				'[ \\[ \\[   ]',
				[
					[{'[ [': 'foo'}, 'foo'],
				],
			],
		]
		.forEach(([template, tests, baseContext, parseOptions], i) => {
			test(`${i}: ${JSON.stringify(template)}`, (test) => {
				const generator = new TemplateString(template, baseContext, parseOptions);
				tests
				.forEach(([context, expected], j) => {
					test(`${i}.${j}: (${JSON.stringify(context)}) → ${JSON.stringify(expected)}`, () => {
						const actual = generator(context);
						assert.equal(actual, expected);
					});
				});
			});
		});
	});

	test('invalid', (test) => {
		[
			[
				'[',
				[
					[null],
				],
			],
		]
		.forEach(([template, tests, baseContext], i) => {
			test(`${i}: ${JSON.stringify(template)}`, (test) => {
				tests
				.forEach(([context], j) => {
					test(`${i}.${j}: (${JSON.stringify(context)})`, () => {
						assert.throws(() => {
							const generator = new TemplateString(template, baseContext);
							return generator(context);
						});
					});
				});
			});
		});
	});

});
