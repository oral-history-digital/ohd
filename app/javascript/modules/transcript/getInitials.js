export default function getInitials(firstName, lastName, locale = 'de') {
    const initials = extractInitialsFromNamePart(firstName) +
        extractInitialsFromNamePart(lastName);

    return initials.toLocaleUpperCase(locale);
}

function extractInitialsFromNamePart(namePart) {
    const initials = namePart.trim()
        .split(' ')
        .map(word => word.trim()[0])
        .join('');
    return initials;
}
