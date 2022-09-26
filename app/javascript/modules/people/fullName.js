export default function fullName(person, locale = 'de', withBirthName = false) {
    const namesObject = person?.names?.[locale] || person?.names?.de;
    if (!namesObject) {
        return '';
    }

    let name = `${namesObject.first_name} ${namesObject.last_name}`;
    if (withBirthName && namesObject.birth_name) {
        name += ` ${namesObject.birth_name}`;
    }
    return name;
}
