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
    const translationLocale = interview.languages.filter(locale => locale !== interview.lang)[0];
    const { t } = useI18n();

    return (
        <div>
            <ul>
                {LinksForTapes(archiveId, numTapes, interview.lang, 'csv')}
                {LinksForTapes(archiveId, numTapes, interview.lang, 'vtt')}
                {translationLocale && LinksForTapes(archiveId, numTapes, translationLocale, 'csv')}
                {translationLocale && LinksForTapes(archiveId, numTapes, translationLocale, 'vtt')}
                <li>
                    <a
                        href={`${pathBase}/edit_tables/${archiveId}.csv`}
                        className="flyout-content-data"
                        download
                    >
                        Erschließungstabelle bandübergreifend (csv)
                    </a>
                </li>
                <li>
                    <a
                        href={`${pathBase}/interviews/${archiveId}/export_photos.zip`}
                        className="flyout-content-data"
                        download
                    >
                        Fotos
                    </a>
                </li>
                <li>
                    <a
                        href={`${pathBase}/interviews/${archiveId}/download_metadata.xml`}
                        className="flyout-content-data"
                        download
                    >
                        Metadaten
                    </a>
                </li>
            </ul>
        </div>
    );
}

function LinksForTapes(archiveId, numTapes, locale, format) {

    const pathBase = usePathBase();
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

DownloadLinks.propTypes = {
    archiveId: PropTypes.string.isRequired,
    numTapes: PropTypes.number.isRequired,
    languages: PropTypes.array.isRequired,
};
