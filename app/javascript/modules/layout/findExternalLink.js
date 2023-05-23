import { SYSTEM_LOCALES, OHD_USAGE_URL, OHD_PRIVACY_URL } from 'modules/constants';

export default function findExternalLink(project, type) {
    const conditions = SYSTEM_LOCALES.reduce((acc, locale) => {
        acc[locale] = OHD_USAGE_URL;
        return acc;
    }, {});

    const privacy_protection = SYSTEM_LOCALES.reduce((acc, locale) => {
        acc[locale] = OHD_PRIVACY_URL;
        return acc;
    }, {});

    const OHD_EXTERNAL_LINKS = {
        conditions,
        privacy_protection,
    };

    const externalLink = project && Object.values(project.external_links).find(link => link.internal_name === type);
    return externalLink ? externalLink.url : OHD_EXTERNAL_LINKS[type];
}
