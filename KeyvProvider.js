/*
Copyright 2018 Jonah Snider

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * @file Keyv provider class
 * @license Apache-2.0
 */

const { SettingProvider } = require('discord.js-commando');

/**
 * A Keyv based SettingProvider for the Discord.js Commando framework.
 * @see {@link https://github.com/lukechilds/keyv | Keyv GitHub}
 * @see {@link https://discord.js.org/#/docs/commando/master/general/welcome | Discord.js Commando documentation}
 * @augments SettingProvider
 */
class KeyvProvider extends SettingProvider {
  /**
   * @param {Keyv} keyv - Keyv instance to use for the store
   */
  constructor(keyv) {
    super();
    this.keyv = keyv;
  }

  /**
	 * Removes all settings in a guild
	 * @param {Guild|string} guild - Guild to clear the settings of
	 * @return {Promise<void>}
	 */
  clear(guild) {
    const target = this.constructor.getGuildID(guild);
    this.keyv.delete(target).then(() => new Promise(resolve => resolve()));
  }

  /**
	 * Destroys the provider, removing any event listeners.
	 */
  destroy() {
    // Remove all listeners from the client
    for (const [event, listener] of this.listeners) this.client.removeListener(event, listener);
    this.listeners.clear();
  }
  /**
	 * Obtains a setting for a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} [defVal] - Value to default to if the setting isn't set on the guild
	 * @returns {*}
	 */
  async get(guild, key, defVal) {
    const target = this.constructor.getGuildID(guild);
    const settings = await this.keyv.get(target);

    if (settings && settings.hasOwnProperty(key)) {
      // Value exists, so return it
      return settings[key];
    } else if (defVal) {
      // Value doesn't exist, so set it to the default value
      return this.set(target, key, defVal);
    }
    return undefined;
  }

  /**
	 * This doesn't really do anything, but Commando calls this so I have to put something here
	 * {@link CommandoClient#setProvider} will automatically call this once the client is ready.
	 * @param {CommandoClient} client - Client that will be using the provider
	 */
  init(client) {
    this.client = client;
  }

  /**
	 * Removes a setting from a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @return {Promise<*>} Old value of the setting
	 */
  async remove(guild, key) {
    const target = this.constructor.getGuildID(guild);
    const prev = await this.keyv.get(target);

    if (prev) {
      const cur = prev;

      delete cur[key];

      return new Promise(resolve => {
        this.keyv.set(target, cur).then(() => resolve(prev[key]));
      });
    }
    return undefined;
  }

  /**
	 * Sets a setting for a guild
	 * @param {Guild|string} guild - Guild to associate the setting with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} val - Value of the setting
	 * @return {Promise<*>} New value of the setting
	 */
  async set(guild, key, val) {
    const target = this.constructor.getGuildID(guild);
    let prev = await this.keyv.get(target);
    if (prev === undefined) prev = {};

    const cur = prev;
    cur[key] = val;

    return new Promise(resolve => {
      this.keyv.set(target, cur).then(() => resolve(val));
    });
  }
}

module.exports = KeyvProvider;
