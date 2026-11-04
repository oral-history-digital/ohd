import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { Disclosure, InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import EntryReferences from './EntryReferences';
import referenceCountTitle from './referenceCountTitle';
import useEntryReferences from './useEntryReferences';

/**
 * Shows references in the current project, or groups all projects for an umbrella.
 *
 * @param {Object} props - Reference display properties.
 * @param {Object} props.registryEntry - Entry whose references are loaded.
 * @param {Function} [props.onSubmit] - Called after selecting a reference.
 * @returns {React.ReactElement|null} References, loading indicator, or error.
 */
export default function EntryReferenceGroups({ registryEntry, onSubmit }) {
    const { t } = useI18n();
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject();
    const {
        isLoading,
        groupedRefs,
        referenceCount,
        error: referencesError,
    } = useEntryReferences(registryEntry);
    const error = projectError || referencesError;

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }

    if (projectIsLoading || !project || isLoading) {
        return <Spinner />;
    }

    const projectRefs = groupedRefs?.filter(
        ([shortname]) => shortname === project.shortname
    );
    const usedReferenceCount = project.is_umbrella
        ? referenceCount
        : projectRefs?.[0]?.[1]?.length || 0;

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

    return null;
}

EntryReferenceGroups.propTypes = {
    registryEntry: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    onSubmit: PropTypes.func,
    setArchiveId: PropTypes.func,
};
