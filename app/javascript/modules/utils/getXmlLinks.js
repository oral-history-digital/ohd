import { OAI_INSTANCE_IDENTIFIER, XML_LINK_TYPES } from '../constants';

function buildOaiRecordLink(locale, metadataPrefix, identifier) {
    return `/${locale}/oai_repository?verb=GetRecord&metadataPrefix=${metadataPrefix}&identifier=${identifier}`;
}

function toXmlLinks(locale, identifier) {
    return XML_LINK_TYPES.map(({ metadataPrefix, text }) => ({
        text,
        metadataPrefix,
        href: buildOaiRecordLink(locale, metadataPrefix, identifier),
    }));
}

export function getProjectXmlLinks({
    locale = 'de',
    projectShortname,
    instanceIdentifier = OAI_INSTANCE_IDENTIFIER,
}) {
    if (!projectShortname) return [];

    const identifier = `oai:${instanceIdentifier}:${projectShortname}`;

    return toXmlLinks(locale, identifier);
}

export function getCollectionXmlLinks({
    locale = 'de',
    collectionId,
    instanceIdentifier = OAI_INSTANCE_IDENTIFIER,
}) {
    if (!collectionId) return [];

    const identifier = `oai:${instanceIdentifier}:collection-${collectionId}`;

    return toXmlLinks(locale, identifier);
}

export default function getXmlLinks({
    type,
    locale = 'de',
    projectShortname,
    collectionId,
    instanceIdentifier = OAI_INSTANCE_IDENTIFIER,
}) {
    if (type === 'project') {
        return getProjectXmlLinks({
            locale,
            projectShortname,
            instanceIdentifier,
        });
    }

    if (type === 'collection') {
        return getCollectionXmlLinks({
            locale,
            collectionId,
            instanceIdentifier,
        });
    }

    return [];
}
