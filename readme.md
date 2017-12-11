# @nlib/template-string

[![Build Status](https://travis-ci.org/nlibjs/template-string.svg?branch=master)](https://travis-ci.org/nlibjs/template-string)
[![Build status](https://ci.appveyor.com/api/projects/status/github/nlibjs/template-string?branch=mater&svg=true)](https://ci.appveyor.com/project/kei-ito/template-string/branch/master)
[![codecov](https://codecov.io/gh/nlibjs/template-string/branch/master/graph/badge.svg)](https://codecov.io/gh/nlibjs/template-string)
[![dependencies Status](https://david-dm.org/nlibjs/template-string/status.svg)](https://david-dm.org/nlibjs/template-string)
[![devDependencies Status](https://david-dm.org/nlibjs/template-string/dev-status.svg)](https://david-dm.org/nlibjs/template-string?type=dev)

Creates a string generator.

## Install

```
npm install @nlib/template-string
```

```javascript
const TemplateString = require('@nlib/template-string');
```

## Usage

```javascript
// Creates a generator
// Strings between [ and ] are recognized as keys.
const generate = new TemplateString('Hello [name1] and [name2]!');

const context1 = {name1: 'foo', name2: 'bar'};
console.log(generate(context1));
// Hello foo and bar!
const context2 = {name1: 'abc', name2: 'def'};
console.log(generate(context2));
// Hello abc and def!

// If a value is a function, it called with the context object
const context3 = {
  name1() {
    return 'pqr';
  },
  name2(context) {
    return `${context.name1}-stu`;
  }
};
console.log(generate(context3));
// Hello pqr and pqr-stu!
```

You can use custom marks.

```javascript
const string = new TemplateString('Hello <value>name</value>!', {
  open: '<value>',
  close: '</value>',
});
console.log(string({name: 'foo'}));
// Hello foo!
```

```javascript
const string = new TemplateString('Hello $name$!', {
  open: '$',
  close: '$',
});
console.log(string({name: 'foo'}));
// Hello foo!
```

## Javascript API

new TemplateString(*template*: String, *baseContext*: Object, *parseOptions*: Object) → *fn*(*context*: any) → String

- *template*: A template string.
- *baseContext*: is used when *fn* generates a string. See [Usage](#usage) section.
- *parseOptions*: configures marks.
  - *open*: String. The default value is '['.
  - *close*: String. The default value is ']'.
  - *escape*: String. The default value is '\'.

- *fn*: A string generator.
- *context*: See [Usage](#usage) section.

## LICENSE

MIT
