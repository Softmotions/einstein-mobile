const moment = require('moment/min/moment-with-locales');
import {LocaleModule} from '../modules/native';

export function getAvailableLocale(locale) {
    const available = moment.locales();

    locale = locale.replace('_', '-').toLowerCase();
    const split = locale.split('-');

    for (let i = split.length; i > 0; i--) {
        let loc = split.slice(0, i).join('-');
        if (available.includes(loc))
            return loc;
    }

    return null;
}

moment.locale(getAvailableLocale(LocaleModule.getString('locale')) || 'en');

export default moment;