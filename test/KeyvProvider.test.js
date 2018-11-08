/* global test expect */
const Keyv = require('keyv');
const KeyvProvider = require('../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

test('sets values', async () => {
  await provider.set('global', 'setTest', 'setTestVal');

  expect((await keyv.get('global')).setTest).toBe('setTestVal');
});

test('gets values with a default', async () => {
  expect(await provider.get('global', 'getTest', 'getTestValWithDefault')).toBe('getTestValWithDefault');
});

test('gets values with no default', async () => {
  await keyv.set('global', { getTest: 'getTestValNoDefault' });
  expect(await provider.get('global', 'getTest')).toBe('getTestValNoDefault');
});

test('removes settings', async () => {
  await keyv.set('global', { removeTest: 'removeTestVal' });
  await provider.remove('global', 'removeTest');
  expect((await keyv.get('global')).removeTest).toBeUndefined();
});

test('clears settings', async () => {
  await keyv.set('global', { clearTest: 'clearTestVal' });
  await provider.clear('global');
  expect(await keyv.get('global')).toBeUndefined();
});
