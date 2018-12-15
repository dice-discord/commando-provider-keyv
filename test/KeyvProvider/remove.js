const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  await keyv.set('global', { removeTest: 'removeTestVal' });
  await provider.remove('global', 'removeTest');

  const setting = (await keyv.get('global')).removeTest;
  childTest.type(setting, undefined, 'removes settings');
});
