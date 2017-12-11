const assert = require('assert');
const console = require('console');
const {PassThrough} = require('stream');
const {TemplateStringTransformer} = require('../..');

const tests = [
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
				'o.foo</value> </val',
				'ue>[bar]<value> baz<',
				'/value> </value>',
			],
			{
				open: '<value>',
				close: '</value>',
			},
		],
		{
			foo: {
				foo({baz}) {
					return baz * 3;
				},
			},
			bar({baz}) {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(baz * 4);
					}, 100);
				});
			},
			baz: -1,
		},
		' -3 </value>[bar]-1 </value>',
	],
];

Promise.all(tests.map(([[chunks, options = {}], context, expected]) => {
	for (let i = 0; i < chunks.length; i++) {
		chunks[i] = Buffer.from(chunks[i]);
	}
	return new Promise((resolve, reject) => {
		const received = [];
		let length = 0;
		const writer = new PassThrough();
		writer
		.pipe(new TemplateStringTransformer(context, options))
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
}))
.then(() => {
	console.log('passed: TemplateStringTransformer');
})
.catch((error) => {
	console.error(error);
	process.exit(1);
});

function writeChunks(chunks, writable, interval = 50) {
	if (0 < chunks.length) {
		writable.write(chunks[0]);
		setTimeout(() => {
			writeChunks(chunks.slice(1), writable, interval);
		}, interval);
	} else {
		writable.end();
	}
}
