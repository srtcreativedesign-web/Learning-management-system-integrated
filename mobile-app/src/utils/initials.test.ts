// Run: node --experimental-strip-types src/utils/initials.test.ts
import assert from 'node:assert/strict';
import { initials } from './initials.ts';

assert.equal(initials('Budi Santoso'), 'BS');
assert.equal(initials('budi'), 'B');
assert.equal(initials('  Dian   Pratama Putra '), 'DP');
assert.equal(initials(''), '?');
assert.equal(initials(undefined), '?');
assert.equal(initials(null), '?');
console.log('initials: ok');
