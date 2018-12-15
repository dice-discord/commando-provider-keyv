const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  await keyv.set('global', { clearTest: 'clearTestVal' });
  await provider.clear('global');

  childTest.type(await keyv.get('global'), undefined, 'clears settings');
});
