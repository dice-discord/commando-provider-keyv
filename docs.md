# Commando Provider Keyv

A [Keyv](https://github.com/lukechilds/keyv) based SettingProvider for the Discord.js Commando framework.

## Back-end Support

- Redis
- MongoDB
- SQLite
- PostgreSQL
- MySQL
- Third-party storage adapters ([see Keyv docs](https://github.com/lukechilds/keyv#third-party-storage-adapters))

## Usage

### In Memory

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

client.setProvider(new KeyvProvider(new Keyv()));
```

### Redis

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

client.setProvider(new KeyvProvider(new Keyv('redis://user:pass@localhost:6379')));
```

### MongoDB

Set the `serialize` and `deserialize` functions to do no transformations, since MongoDB can support storing raw JSON.

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

const settings = { serialize: data => data, deserialize: data => data };

client.setProvider(new KeyvProvider(new Keyv('mongodb://user:pass@localhost:27017/dbname', settings)));
```

### SQLite

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

client.setProvider(new KeyvProvider(new Keyv(sqlite://path/to/dbname.sqlite)));
```

### PostgreSQL

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

client.setProvider(new KeyvProvider(new Keyv('postgresql://user:pass@localhost:5432/dbname')));
```

### MySQL

```js
const { CommandoClient } = require('discord.js-commando');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');

const client = new CommandoClient();

client.setProvider(new KeyvProvider(new Keyv('mysql://user:pass@localhost:3306/dbname')));
```
