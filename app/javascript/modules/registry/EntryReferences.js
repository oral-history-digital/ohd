import PropTypes from 'prop-types';

import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import SegmentLinks from './SegmentLinks';
import useEntryReferencesAlt from './useEntryReferencesAlt';

export default function EntryReferences({
    projects,
    registryEntry,
    isLoggedIn,
    onSubmit,
    setArchiveId,
}) {
    const { t } = useI18n();
    //const { isLoading, referencesCount, data } = useEntryReferences(registryEntry);
    const { isLoading, isValidating, data, interviewReferences, segmentReferences,
        error } = useEntryReferencesAlt(registryEntry);

    const referencesCount = interviewReferences?.length;

    function title() {
        const refTranslation = referencesCount === 1
            ? t('activerecord.models.registry_reference.one')
            : t('activerecord.models.registry_reference.other');
        return `${referencesCount} ${refTranslation}`;
    }

    return (
        <>
            <h4>{title()}</h4>
            {isLoading ?
                <Spinner/> : (
                <ul className="UnorderedList">
                    {interviewReferences.map(({ archive_id, project_id, display_name }) => {
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

                                {/*isLoggedIn && (
                                    <SegmentLinks
                                        references={segmentReferences}
                                        onSubmit={onSubmit}
                                    />
                                )*/}
                            </li>
                        );
                    })}
                </ul>
            )}
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
