const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  const val = await provider.get('global', 'getTest', 'getTestValWithDefault');

  childTest.equal(val, 'getTestValWithDefault', 'gets values with a default');

  await keyv.set('global', { getTest: 'getTestValNoDefault' });
  childTest.equal(await provider.get('global', 'getTest'), 'getTestValNoDefault', 'gets values with no default');
});
