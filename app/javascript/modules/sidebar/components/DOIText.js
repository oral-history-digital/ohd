import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function DOIText({
    selectedArchiveIds,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    function exportDOI() {
        // TODO: Should this function still exist?
    }

    return (
        <AuthorizedContent object={{ type: 'Interview' }} action="dois">
            {' '}
            <Modal
                title={t('doi.title')}
                trigger={t('doi.title')}
                triggerClassName="flyout-sub-tabs-content-ico-link"
            >
                {' '}
                {(close) => (
                    <form className="Form">
                        {' '}
                        {t('doi.text1') + ' '}{' '}

                        {
                            selectedArchiveIds.map((archiveId, i) => [
                                i > 0 && ', ',
                                <a
                                    href={`/${pathBase}/interviews/${archiveId}/metadata.xml`}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={`link-to-${archiveId}`}
                                >
                                    {archiveId}
                                </a>,
                            ])
                        }

                        {' ' + t('doi.text2')}{' '}
                        <div className="Form-footer u-mt">
                            {' '}
                            <button
                                type="button"
                                className="Button Button--primaryAction"
                                onClick={() => {
                                    exportDOI();
                                    close();
                                }}
                            >
                                {' '}
                                {t('doi.ok')}{' '}
                            </button>{' '}
                            <button
                                type="button"
                                className="Button Button--secondaryAction"
                                onClick={close}
                            >
                                {' '}
                                {t('cancel')}{' '}
                            </button>{' '}
                        </div>{' '}
                    </form>
                )}{' '}
            </Modal>{' '}
        </AuthorizedContent>
    );
}

DOIText.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};
