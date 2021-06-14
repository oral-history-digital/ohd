export default function findExternalLink(project, type) {

    //
    // TODO: fit these links
    //
    const OHD_EXTERNAL_LINKS = {
        conditions: {
            de: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            en: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            el: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            es: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            ru: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
        },
        privacy_protection: {
            de: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            en: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            el: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            es: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
            ru: 'https://www.oral-history.digital/impressum/datenschutzhinweise/index.html',
        }
    }

    const externalLink = project && Object.values(project.external_links).find(link => link.internal_name === type);
    return externalLink ? externalLink.url : OHD_EXTERNAL_LINKS[type]
}

