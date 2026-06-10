export function personName(person) {
    if (!person || typeof person !== 'object') {
        return '';
    }

    const directName = person?.name?.trim() || '';
    const firstName = person?.first_name?.trim() || '';
    const lastName = person?.last_name?.trim() || '';
    const personalName = [firstName, lastName].filter(Boolean).join(' ');

    if (person?.name_type === 'Personal') {
        return personalName;
    }

    if (person?.name_type === 'Organizational') {
        return directName;
    }

    return directName || personalName;
}
