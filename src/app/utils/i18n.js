'use strict';

import {LocaleModule} from '../modules/native';

class Section {
  __section = null;

  constructor(section) {
    this.__section = section;
  }

  __getString(name) {
    const key = this.__section + '_' + arguments[0];
    const str = LocaleModule.getString(key);
    if (!str) {
      console.warn('Undefined translation key:', key);
      return key;
    }
    return str;
  }

  tr() {
    const str = this.__getString(arguments[0]);
    const args = Array.from(arguments).slice(1);
    return args.length > 0 ? str.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    }) : str;
  }
}

class I18N {
  __sections = {};

  constructor() {
    // aliases
    this.tr('button');
    this.tr('message');
    this.tr('help');
    this.tr('statistics');
    this.tr('status')
  }

  initSection(name) {
    if (!this.__sections[name]) {
      let section = new Section(name);
      this.__sections[name] = section;
      this.__defineGetter__(name, () => (section));
    }

    return this.__sections[name];
  };

  getSection = (name) => this.initSection(name);

  tr = (name) => this.initSection(name);
}

const i18n = new I18N();

export {
  i18n
}