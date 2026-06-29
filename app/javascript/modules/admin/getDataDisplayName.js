import { localizedValue } from 'modules/utils';

export default function getDataDisplayName(data, locale) {
    const localizedText = (value) => {
        return localizedValue(value, locale, { emptyValue: undefined });
    };

    if (data.title && data.type !== 'Person') {
        return localizedText(data.title);
    }

    if (data.name_type === 'Personal' && data.first_name && data.last_name) {
        const firstName = localizedText(data.first_name);
        const lastName = localizedText(data.last_name);

        return `${firstName || ''} ${lastName || ''}`.trim();
    }

    if (data.name) {
        return localizedText(data.name);
    }

    return localizedText(data.code) || '';
}
