import PropTypes from 'prop-types';
//import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';

import { Disclosure } from 'modules/ui';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import EntryReferences from './EntryReferences';
import useEntryReferences from './useEntryReferences';
import { useProject } from 'modules/routes';

export default function EntryReferenceGroups({
    registryEntry,
    onSubmit,
}) {
    const { t } = useI18n();
    const { project, projectId } = useProject();
    const { isLoading, groupedRefs, referenceCount, error } = useEntryReferences(registryEntry);
    const projectRefs = groupedRefs?.filter(([shortname]) => shortname === project.shortname);
    const usedReferenceCount = project.is_ohd ? referenceCount : projectRefs?.[0][1]?.length || 0;

    function title() {
        const refTranslation = usedReferenceCount === 1
            ? t('activerecord.models.registry_reference.one')
            : t('activerecord.models.registry_reference.other');
        return `${usedReferenceCount} ${refTranslation}`;
    }

    if (isLoading) {
        return <Spinner/>;
    }

    if (!project.is_ohd) {
        return (
            <>
                <h4>{title()}</h4>
                <EntryReferences
                    references={projectRefs[0][1]}
                    onSubmit={onSubmit}
                />
            </>
        );
    } else {
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
