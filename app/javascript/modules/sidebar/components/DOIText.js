import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

export default function DOIText({ selectedArchiveIds }) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    return (
        <>
            {t('doi.text1') + ' '}{' '}
            {selectedArchiveIds.map((archiveId, i) => [
                i > 0 && ', ',
                <a
                    href={`/${pathBase}/interviews/${archiveId}/metadata.xml`}
                    target="_blank"
                    rel="noreferrer"
                    key={`link-to-${archiveId}`}
                >
                    {archiveId}
                </a>,
            ])}
            {' ' + t('doi.text2')}
        </>
    );
}

DOIText.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};
