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
    const args = arguments;
    let str = LocaleModule.getString(key);
    if (!str) {
      console.warn("!!!!!", key);
      str = key;
    }
    return str.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number + 1] != 'undefined' ? args[number + 1] : match;
    });
  }
}

class I18N {
  __sections = {};

  initSection(name) {
    if (!this.__sections[name]) {
      let section = new Section(name);
      this.__sections[name] = section;
      this.__defineGetter__(name, () => (section));
    }

    return this.__sections[name];
  };

  getSection = (name) => this.initSection(name);

  // aliases
  get button() {
    return this.getSection('button');
  }
}

const i18n = new I18N();

export {
  i18n
}