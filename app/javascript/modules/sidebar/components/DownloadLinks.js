import PropTypes from 'prop-types';

import { usePathBase } from 'modules/routes';
import LinksForTapes from './LinksForTapes';

export default function DownloadLinks({
    archiveId,
    numTapes,
    interview,
}) {
    const pathBase = usePathBase();
    const translationLocale = interview.translation_locale;
    const hasTranscript = interview.transcript_locales?.indexOf(interview.lang) > -1;
    const hasTranslation = interview.transcript_locales?.indexOf(translationLocale) > -1;

    return (
        <div>
            <ul className="UnorderedList">
                {hasTranscript && (
                    <LinksForTapes
                        archiveId={archiveId}
                        numTapes={numTapes}
                        locale={interview.lang}
                        format="csv"
                    />
                )}
                {hasTranscript && (
                    <LinksForTapes
                        archiveId={archiveId}
                        numTapes={numTapes}
                        locale={interview.lang}
                        format="vtt"
                    />
                )}
                {hasTranslation && translationLocale && (
                    <LinksForTapes
                        archiveId={archiveId}
                        numTapes={numTapes}
                        locale={translationLocale}
                        format="csv"
                    />
                )}
                {hasTranslation && translationLocale && (
                    <LinksForTapes
                        archiveId={archiveId}
                        numTapes={numTapes}
                        locale={translationLocale}
                        format="vtt"
                    />
                )}
                { hasTranscript && dataLink(`${pathBase}/edit_tables/${archiveId}.csv`, 'Erschließungstabelle bandübergreifend (csv)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_photos.zip`, 'Fotos (alle)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_photos.zip?only_public=true`, 'Fotos (nur öffentliche)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/download_metadata.xml`, 'Metadaten (DataCite)') }
                { dataLink(`${pathBase}/interviews/${archiveId}/export_all.zip`, 'Alle Daten herunterladen') }
            </ul>
        </div>
    );
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
