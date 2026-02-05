export default function referenceCountTitle(t, referenceCount) {
    const refTranslation =
        referenceCount === 1
            ? t('activerecord.models.registry_reference.one')
            : t('activerecord.models.registry_reference.other');
    return `${referenceCount} ${refTranslation}`;
}
