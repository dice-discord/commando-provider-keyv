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

const { SettingProvider } = require("discord.js-commando");

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
    this.listeners = new Map();
    this.client = undefined;
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

    if (settings && Object.prototype.hasOwnProperty.call(settings, key)) {
      // Value exists, so return it
      return settings[key];
    } else if (defVal) {
      // Value doesn't exist, so set it to the default value
      return this.set(target, key, defVal);
    }
    return undefined;
  }

  /**
   * Initialises the provider by connecting to databases and/or caching all data in memory.
   * {@link CommandoClient#setProvider} will automatically call this once the client is ready.
   * @param {CommandoClient} client - Client that will be using the provider
   */
  init(client) {
    this.client = client;

    client.guilds.forEach(async guild => {
      const settings = await this.keyv.get(guild.id);

      if (settings) {
        this.setupGuild(guild, settings);
      }
    });

    this.listeners
      .set("commandPrefixChange", (guild, prefix) => this.set(guild.id, "prefix", prefix))
      .set("commandStatusChange", (guild, command, enabled) => this.set(guild.id, `cmd-${command.name}`, enabled))
      .set("groupStatusChange", (guild, group, enabled) => this.set(guild.id, `grp-${group.id}`, enabled));

    for (const [event, listener] of this.listeners) client.on(event, listener);
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
      const old = prev[key];

      delete prev[key];

      return new Promise(resolve => {
        return this.keyv.set(target, prev).then(() => {return resolve(old);});
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
      if (target === "global") {
        this.keyv.set(target, cur, 0).then(() => resolve(val));
      } else {
        this.keyv.set(target, cur).then(() => resolve(val));
      }
    });
  }

  /**
   * Loads all settings for a guild
   * @param {string} guild - Guild ID to load the settings of (or 'global')
   * @param {Object} settings - Settings to load
   * @private
   */
  setupGuild(guild, settings) {
    // Load the command prefix
    if (settings.prefix) {
      if (guild) {
        guild._commandPrefix = settings.prefix;
      } else {
        this.client._commandPrefix = settings.prefix;
      }
    }

    // Load all command/group statuses
    for (const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings);
    for (const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings);
  }

  /**
   * Sets up a command's status in a guild from the guild's settings
   * @param {?Guild} guild - Guild to set the status in
   * @param {Command} command - Command to set the status of
   * @param {Object} settings - Settings of the guild
   * @private
   */
  setupGuildCommand(guild, command, settings) {
    if (typeof settings[`cmd-${command.name}`] === "undefined") return;
    if (guild) {
      if (!guild._commandsEnabled) guild._commandsEnabled = {};
      guild._commandsEnabled[command.name] = settings[`cmd-${command.name}`];
    } else {
      command._globalEnabled = settings[`cmd-${command.name}`];
    }
  }

  /**
   * Sets up a group's status in a guild from the guild's settings
   * @param {?Guild} guild - Guild to set the status in
   * @param {CommandGroup} group - Group to set the status of
   * @param {Object} settings - Settings of the guild
   * @private
   */
  setupGuildGroup(guild, group, settings) {
    if (typeof settings[`grp-${group.id}`] === "undefined") return;
    if (guild) {
      if (!guild._groupsEnabled) guild._groupsEnabled = {};
      guild._groupsEnabled[group.id] = settings[`grp-${group.id}`];
    } else {
      group._globalEnabled = settings[`grp-${group.id}`];
    }
  }
}

module.exports = KeyvProvider;
