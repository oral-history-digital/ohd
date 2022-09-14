export default function fullname(props, person, withBirthName=false, locale=props.locale) {
    if (person) {
        try {
            let name = `${person.names[locale].first_name} ${person.names[locale].last_name}`;
            let birthName = person.names[locale].birth_name;
            if (withBirthName && birthName)
                name += person.names[locale].birth_name;
            return name;
        } catch (e) {
            if(locale == 'de') {
                return ''
            }
            else {
                return fullname(props, person, false, 'de');
            }
        }
    }
}
