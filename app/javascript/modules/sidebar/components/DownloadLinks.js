import PropTypes from 'prop-types';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function DownloadLinks({
    archiveId,
    numTapes,
    interview,
}) {
    const pathBase = usePathBase();
    const translationLocale = interview.languages?.filter(locale => locale !== interview.lang)[0];
    const hasTranscript = interview.transcript_locales.indexOf(interview.lang) > -1;
    const hasTranslation = interview.transcript_locales.indexOf(translationLocale) > -1;

    return (
        <div>
            <ul>
                { hasTranscript && LinksForTapes(pathBase, archiveId, numTapes, interview.lang, 'csv') }
                { hasTranscript && LinksForTapes(pathBase, archiveId, numTapes, interview.lang, 'vtt') }
                { hasTranslation && translationLocale && LinksForTapes(pathBase, archiveId, numTapes, translationLocale, 'csv') }
                { hasTranslation && translationLocale && LinksForTapes(pathBase, archiveId, numTapes, translationLocale, 'vtt') }
                { hasTranscript && dataLink(`${pathBase}/edit_tables/${archiveId}.csv`, 'Erschließungstabelle bandübergreifend (csv)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_photos.zip`, 'Fotos (alle)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_photos.zip?only_public=true`, 'Fotos (nur öffentliche)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/download_metadata.xml`, 'Metadaten (DataCite)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_all.zip`, 'Alle Daten herunterladen') }
            </ul>
        </div>
    );
}

function LinksForTapes(pathBase, archiveId, numTapes, locale, format) {

    const { t } = useI18n();
    const tapeNumbers = Array.from({length: numTapes}, (_, index) => index + 1);

    return (
        tapeNumbers.map(tapeNumber => (
            <li key={`${tapeNumber}-${locale}`}>
                <a
                    href={`${pathBase}/interviews/${archiveId}.${format}?lang=${locale}&tape_number=${tapeNumber}`}
                    download
                >
                    {`${t('transcript')} ${t('tape')} ${tapeNumber}: ${t(locale)} (${format})`}
                </a>
            </li>
        ))
    )
}

function dataLink(link, title) {
    return (
        <li>
            <a
                href={link}
                className="flyout-content-data"
                download
            >
                {title}
            </a>
        </li>
    )
}

DownloadLinks.propTypes = {
    archiveId: PropTypes.string.isRequired,
    numTapes: PropTypes.number.isRequired,
    interview: PropTypes.object.isRequired,
};
