import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { Disclosure } from 'modules/ui';
import PropTypes from 'prop-types';

import EntryReferences from './EntryReferences';
import referenceCountTitle from './referenceCountTitle';
import useEntryReferences from './useEntryReferences';

export default function EntryReferenceGroups({ registryEntry, onSubmit }) {
    const { t } = useI18n();
    const { project } = useProject();
    const { isLoading, groupedRefs, referenceCount } =
        useEntryReferences(registryEntry);
    const projectRefs = groupedRefs?.filter(
        ([shortname]) => shortname === project.shortname
    );
    const usedReferenceCount = project.is_umbrella
        ? referenceCount
        : projectRefs?.[0]?.[1]?.length || 0;

    if (isLoading) {
        return <Spinner />;
    }

    if (!project.is_umbrella && usedReferenceCount > 0) {
        return (
            <>
                <h4>{referenceCountTitle(t, usedReferenceCount)}</h4>
                <EntryReferences
                    references={projectRefs[0][1]}
                    onSubmit={onSubmit}
                />
            </>
        );
    } else if (project.is_umbrella) {
        return (
            <>
                <h4>{referenceCountTitle(t, usedReferenceCount)}</h4>

                {groupedRefs?.map(([shortname, references]) => (
                    <Disclosure
                        key={shortname}
                        title={shortname}
                        contentClassName="u-mt-none u-mb-small"
                    >
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
    registryEntry: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    onSubmit: PropTypes.func,
    setArchiveId: PropTypes.func,
};
