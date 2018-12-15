const tap = require('tap');
const Keyv = require('keyv');
const KeyvProvider = require('../../src/KeyvProvider');

const keyv = new Keyv();
const provider = new KeyvProvider(keyv);

tap.test(async childTest => {
  const val = 'removeTestVal';

  childTest.type(
    await provider.remove('global', val),
    undefined,
    'returns undefined when deleting something that doesn\'t exist'
  );

  await keyv.set('global', { removeTest: val });

  childTest.ok(await keyv.get('global', { removeTest: val }), 'value exists before being removed');

  const old = await provider.remove('global', 'removeTest');

  const setting = (await keyv.get('global')).removeTest;

  childTest.type(setting, undefined, 'removes settings');

  childTest.equal(old, val, 'returns old value');
});
