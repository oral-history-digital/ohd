import { t } from 'modules/i18n';
import { PERSON_GENDER_FEMALE, PERSON_GENDER_MALE } from './constants';

const defaultOptions = {
    locale: 'de',
    fallbackLocale: 'de',
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

    let firstName = person.names?.[options.locale]?.first_name;
    let lastName = person.names?.[options.locale]?.last_name;
    let birthName = person.names?.[options.locale]?.birth_name;

    if (!firstName) {
        firstName = person.names?.[options.fallbackLocale]?.first_name;
    }
    if (!lastName) {
        lastName = person.names?.[options.fallbackLocale]?.last_name;
    }
    if (!birthName) {
        birthName = person.names?.[options.fallbackLocale]?.birth_name;
    }

    let name = `${firstName} ${lastName}`;

    if (options.withBirthName && birthName) {
        name += ` ${birthName}`;
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
