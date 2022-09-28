import { t } from 'modules/i18n';
import { PERSON_GENDER_FEMALE, PERSON_GENDER_MALE } from './constants';

const defaultOptions = {
    locale: 'de',
    withBirthName: false,
    withTitle: false
};

export default function formatPersonName(person, translations, userOptions) {
    const options = {
        ...defaultOptions,
        ...userOptions,
    };

    if (!person) {
        return '';
    }

    const namesObject = person.names?.[options.locale] || person.names?.de;
    if (!namesObject) {
        return '';
    }

    let name = `${namesObject.first_name} ${namesObject.last_name}`;

    if (options.withBirthName && namesObject.birth_name) {
        name += ` ${namesObject.birth_name}`;
    }

    if (options.withTitle) {
        name = addPersonTitle(name, person, options.locale, translations);
    }

    return name;
}

function addPersonTitle(name, person, locale, translations) {
    if (!person.title) {
        return name;
    }

    const gender = person.gender === PERSON_GENDER_FEMALE ?
        PERSON_GENDER_FEMALE :
        PERSON_GENDER_MALE;

    const title = t({ locale, translations },
        `modules.person.abbr_titles.${person.title}_${gender}`);

    return `${title} ${name}`;
}
