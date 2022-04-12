import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { submitDois, getDoiResult  } from 'modules/archive';

export default function DOIData({
    selectedArchiveIds,
}) {
    const { t, locale } = useI18n();
    const dispatch = useDispatch();
    const doiResult = useSelector(getDoiResult);

    function exportDOI() {
        dispatch(submitDois(selectedArchiveIds, locale));
    }

    return (
        <>
            {Object.keys(doiResult).length > 0 && (
                <div>
                    <h4>DOI Status:</h4>
                    {
                        Object.keys(doiResult).map(archiveId => (
                            <div key={archiveId}>
                                {`${archiveId}: ${doiResult[archiveId]}`}
                            </div>
                        ))
                    }
                </div>
            )}
            <AuthorizedContent object={{type: 'Interview'}} action='dois'>
                <Modal
                    title={t('doi.title')}
                    trigger={t('doi.title')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <form className="Form">
                            {t('doi.text1')}
                            {' '}
                            {
                                selectedArchiveIds.map((archiveId, i) => [
                                    i > 0 && ", ",
                                    (<a
                                        href={`/${locale}/interviews/${archiveId}/metadata.xml`}
                                        target='_blank'
                                        rel="noreferrer"
                                        key={archiveId}
                                    >
                                        {archiveId}
                                    </a>)
                                ])
                            }
                            {' '}
                            {t('doi.text2')}

                            <div className="Form-footer u-mt">
                                <button
                                    type="button"
                                    className="Button Button--primaryAction"
                                    onClick={() => {
                                        exportDOI();
                                        close();
                                    }}
                                >
                                    {t('doi.ok')}
                                </button>
                                <button
                                    type="button"
                                    className="Button Button--secondaryAction"
                                    onClick={close}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            </AuthorizedContent>
        </>
    );
}

DOIData.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};
