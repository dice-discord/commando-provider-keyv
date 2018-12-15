const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  const tag1 = 'getTestValWithDefault';
  const val = await provider.get('global', tag1, tag1);

  childTest.equal(val, tag1, 'gets values with a default');

  const tag2 = 'getTestValNoDefault';
  await keyv.set('global', { getTestValNoDefault: tag2 });
  childTest.equal(await provider.get('global', tag2), tag2, 'gets values with no default');

  childTest.type(
    await provider.get('global', 'getTestUndefinedValue'),
    undefined,
    'returns undefined when getting a value that doesn\'t exist'
  );
});
