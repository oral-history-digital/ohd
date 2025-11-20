import PropTypes from 'prop-types';
import { useI18n } from 'modules/i18n';

import { usePathBase } from 'modules/routes';
import LinksForTapes from './LinksForTapes';

export default function DownloadLinks({ archiveId, numTapes, interview }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const hasTranscript = interview.alpha3s_with_transcript.length > 0;

    return (
        <div>
            <ul className="UnorderedList">
                {interview.alpha3s_with_transcript.map((locale) => (
                    <>
                        <LinksForTapes
                            archiveId={archiveId}
                            numTapes={numTapes}
                            locale={locale}
                            format="csv"
                        />
                        <LinksForTapes
                            archiveId={archiveId}
                            numTapes={numTapes}
                            locale={locale}
                            format="vtt"
                        />
                    </>
                ))}
                {hasTranscript &&
                    dataLink(
                        `${pathBase}/edit_tables/${archiveId}.csv`,
                        `${t('edit_table')} ${t('all_tapes')} (csv)`
                    )}
                {dataLink(
                    `${pathBase}/interviews/${archiveId}/export_photos.zip`,
                    `${t('photos')} (${t('workflow_states.all')})`
                )}
                {dataLink(
                    `${pathBase}/interviews/${archiveId}/export_photos.zip?only_public=true`,
                    `${t('photos')} (${t('only_public')})`
                )}
                {dataLink(
                    `${pathBase}/interviews/${archiveId}/download_datacite.xml`,
                    `${t('activerecord.models.metadata_field.other')} (DataCite)`
                )}
                {dataLink(
                    `${pathBase}/interviews/${archiveId}/export_all.zip`,
                    `${t('download_all_data')}`
                )}
            </ul>
        </div>
    );
}

function dataLink(link, title) {
    return (
        <li>
            <a href={link} className="flyout-content-data" download>
                {title}
            </a>
        </li>
    );
}

DownloadLinks.propTypes = {
    archiveId: PropTypes.string.isRequired,
    numTapes: PropTypes.number.isRequired,
    interview: PropTypes.object.isRequired,
};
