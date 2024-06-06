import PropTypes from 'prop-types';

import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import SegmentReference from './SegmentReference';
import useEntryReferences from './useEntryReferences';

export default function EntryReferences({
    projects,
    registryEntry,
    isLoggedIn,
    onSubmit,
    setArchiveId,
}) {
    const { t } = useI18n();
    const { isLoading, interviewReferences, error } = useEntryReferences(registryEntry);

    const referencesCount = interviewReferences?.length || 0;

    function title() {
        const refTranslation = referencesCount === 1
            ? t('activerecord.models.registry_reference.one')
            : t('activerecord.models.registry_reference.other');
        return `${referencesCount} ${refTranslation}`;
    }

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <>
            <h4>{title()}</h4>
            <ul className="UnorderedList">
                {interviewReferences?.map(({ archive_id, project_id, display_name,
                    segment_references }) => {
                    return (
                        <li key={archive_id}>
                            <LinkOrA
                                project={projects[project_id]}
                                to={`interviews/${archive_id}`}
                                onLinkClick={() => setArchiveId(archive_id)}
                                className="search-result-link"
                            >
                                {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${display_name} (${archive_id})`}
                            </LinkOrA>

                            {isLoggedIn && (
                            <ul className="HorizontalList">
                                {segment_references.map((segmentRef) => (
                                    <li key={segmentRef.id} className="HorizontalList-item">
                                        <SegmentReference
                                            segmentRef={segmentRef}
                                            onSubmit={onSubmit}
                                        />
                                    </li>
                                ))}
                            </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    )
}

EntryReferences.propTypes = {
    projects: PropTypes.array.isRequired,
    registryEntry: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    onSubmit: PropTypes.func,
    setArchiveId: PropTypes.func,
};
