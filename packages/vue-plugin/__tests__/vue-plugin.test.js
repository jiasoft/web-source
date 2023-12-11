'use strict';

const vuePlugin = require('..');
const assert = require('assert').strict;

assert.strictEqual(vuePlugin(), 'Hello from vuePlugin');
console.info('vuePlugin tests passed');
