const assert = require('assert');
const test = require('@nlib/test');
const {PassThrough} = require('stream');
const {TransformTemplateString} = require('../..');

test('TransformTemplateString', (test) => {

	[
		[
			[
				[
					'foo[fo',
					'o]',
					'bar[ba\n',
					'r]',
				],
			],
			{
				foo: 123,
				bar: 456,
			},
			'foo123bar[ba\nr]',
		],
		[
			[
				[
					' <value>fo',
					'o</value> </val',
					'ue>[bar]<value> baz<',
					'/value> </value>',
				],
				{
					open: '<value>',
					close: '</value>',
				},
			],
			{
				foo({baz}) {
					return baz * 3;
				},
				bar({baz}) {
					return baz * 4;
				},
				baz: -1,
			},
			' -3 </value>[bar]-1 </value>',
		],
	]
	.forEach(([[chunks, options = {}], context, expected]) => {
		chunks = chunks
		.map((chunk) => {
			return Buffer.from(chunk);
		});
		const source = Buffer.concat(chunks);
		test(`${JSON.stringify(source.toString())} (${JSON.stringify([context, options])}) → ${JSON.stringify(expected)}`, () => {
			return new Promise((resolve, reject) => {
				const received = [];
				let length = 0;
				const writer = new PassThrough();
				writer
				.pipe(new TransformTemplateString(context, options))
				.once('error', reject)
				.once('end', () => {
					resolve(Buffer.concat(received, length));
				})
				.on('data', (chunk) => {
					received.push(chunk);
					length += chunk.length;
				});
				writeChunks(chunks, writer);
			})
			.then((actual) => {
				assert.equal(actual.toString(), expected.toString());
			});
		});
	});

});

function writeChunks(chunks, writable) {
	if (0 < chunks.length) {
		writable.write(chunks[0]);
		setTimeout(() => {
			writeChunks(chunks.slice(1), writable);
		}, 50);
	} else {
		writable.end();
	}
}
