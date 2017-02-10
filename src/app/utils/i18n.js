'use strict';

import {LocaleModule} from '../modules/native';

// const Message = {
//   get: function (target, name) {
//     const key = target.section + '_' + name;
//     const str = Locale.getString(key) || key;
//
//     return new Proxy(str, {
//       apply: function (target, name, args) {
//         if ('tr' == name) {
//
//         }
//         return target.apply(name, args);
//       }
//     });
//   },
// };

class Section {
  __section = null;

  constructor(section) {
    this.__section = section;
  }

  tr() {
    const key = this.__section + '_' + arguments[0];
    const args = Array.from(arguments).slice(1);
    let str = LocaleModule.getString(key);
    if (!str) {
      console.warn('Undefined translation key:', key);
      str = key;
    }
    return str.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
}

class I18N {
  __sections = {};

  constructor() {
    // aliases
    this.tr('button');
    this.tr('message');
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