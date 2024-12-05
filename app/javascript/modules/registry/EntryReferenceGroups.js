import PropTypes from 'prop-types';
//import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';

import { Disclosure } from 'modules/ui';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import EntryReferences from './EntryReferences';
import useEntryReferences from './useEntryReferences';

export default function EntryReferenceGroups({
    registryEntry,
    onSubmit,
}) {
    const { t } = useI18n();
    const { isLoading, groupedRefs, referenceCount, error } = useEntryReferences(registryEntry);

    function title() {
        const refTranslation = referenceCount === 1
            ? t('activerecord.models.registry_reference.one')
            : t('activerecord.models.registry_reference.other');
        return `${referenceCount} ${refTranslation}`;
    }

    if (isLoading) {
        return <Spinner/>;
    }

    if (groupedRefs?.length === 1) {
        return (
            <>
                <h4>{title()}</h4>
                <EntryReferences
                    references={groupedRefs[0][1]}
                    onSubmit={onSubmit}
                />
            </>
        );
    } else if (groupedRefs?.length >= 2) {
        return (
            <>
                <h4>{title()}</h4>

                {groupedRefs?.map(([shortname, references]) => (
                    <Disclosure key={shortname} title={shortname} contentClassName="u-mt-none u-mb-small">
                        <EntryReferences
                            references={references}
                            onSubmit={onSubmit}
                        />
                    </Disclosure>
                ))}
            </>
        );
    }
}

EntryReferenceGroups.propTypes = {
    projects: PropTypes.array.isRequired,
    registryEntry: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    onSubmit: PropTypes.func,
    setArchiveId: PropTypes.func,
};
