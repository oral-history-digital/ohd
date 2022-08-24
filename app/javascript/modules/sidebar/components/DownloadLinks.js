import { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import SubmitInterviewIds from './SubmitInterviewIds';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function DownloadLinks({
    archiveId,
    numTapes,
    languages,
    interview,
}) {
    const pathBase = usePathBase();
    const translationLocale = interview.languages?.filter(locale => locale !== interview.lang)[0];
    const { t } = useI18n();

    return (
        <div>
            <ul>
                { LinksForTapes(pathBase, archiveId, numTapes, interview.lang, 'csv') }
                { LinksForTapes(pathBase, archiveId, numTapes, interview.lang, 'vtt') }
                { translationLocale && LinksForTapes(pathBase, archiveId, numTapes, translationLocale, 'csv') }
                { translationLocale && LinksForTapes(pathBase, archiveId, numTapes, translationLocale, 'vtt') }
                { dataLink(`${pathBase}/edit_tables/${archiveId}.csv`, 'Erschließungstabelle bandübergreifend (csv)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_photos.zip`, 'Fotos') }
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
    languages: PropTypes.array.isRequired,
};
