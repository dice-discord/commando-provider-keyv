const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  await provider.set('global', 'setTest', 'setTestVal');

  childTest.match(await keyv.get('global'), { setTest: 'setTestVal' }, 'sets values');
});
