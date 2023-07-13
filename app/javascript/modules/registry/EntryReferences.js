import PropTypes from 'prop-types';

import { PixelLoader } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import SegmentLinks from './SegmentLinks';
import useEntryReferences from './useEntryReferences';

export default function EntryReferences({
    projects,
    registryEntry,
    isLoggedIn,
    onSubmit,
    setArchiveId,
}) {
    const { t } = useI18n();
    const { isLoading, referencesCount, data } = useEntryReferences(registryEntry);

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
                <PixelLoader/> : (
                <ul className="UnorderedList">
                    {data.map(({ loaded, archiveId, projectId, title, segmentReferences }) => {
                        if (!loaded) {
                            return (
                                <li key={archiveId}>
                                    {t('loading')}
                                </li>
                            );
                        }

                        return (
                            <li key={archiveId}>
                                <LinkOrA
                                    project={projects[projectId]}
                                    to={`interviews/${archiveId}`}
                                    onLinkClick={() => setArchiveId(archiveId)}
                                    className="search-result-link"
                                >
                                    {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${title} (${archiveId})`}
                                </LinkOrA>
                                {isLoggedIn && (
                                    <SegmentLinks
                                        references={segmentReferences}
                                        onSubmit={onSubmit}
                                    />
                                )}
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
