export default function getInitials(firstName, lastName, locale = 'de') {
    const initials = extractInitialFromNamePart(firstName) +
        extractInitialFromNamePart(lastName);

    return initials.toLocaleUpperCase(locale);
}

function extractInitialFromNamePart(namePart) {
    return namePart.trim()[0];
}
