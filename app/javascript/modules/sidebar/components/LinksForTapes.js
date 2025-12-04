import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function LinksForTapes({ archiveId, numTapes, locale, format }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const tapeNumbers = Array.from(
        { length: numTapes },
        (_, index) => index + 1
    );

    return tapeNumbers.map((tapeNumber) => (
        <li key={`${tapeNumber}-${locale}`}>
            <a
                href={`${pathBase}/interviews/${archiveId}.${format}?lang=${locale}&tape_number=${tapeNumber}`}
                download
            >
                {`${t('transcript')} ${t('tape')} ${tapeNumber}: ${t(locale)} (${format})`}
            </a>
        </li>
    ));
}
