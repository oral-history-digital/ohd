import { AuthorizedContent } from 'modules/auth';
import { deleteData } from 'modules/data';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Confirms deletion of selected interviews and returns detail pages to search results.
 *
 * @param {Object} props - Selected interviews.
 * @param {string[]} props.selectedArchiveIds - Public interview identifiers.
 * @returns {React.ReactElement} Permission-gated deletion dialog.
 */
export default function DeleteInterviews({ selectedArchiveIds }) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    /** Deletes through the current route and leaves a deleted interview detail page. */
    function deleteInterviews() {
        selectedArchiveIds.forEach((archiveId) =>
            dispatch(deleteData({ pathBase }, 'interviews', archiveId))
        );

        const isDetailPage = new RegExp(`^${pathBase}/interviews`);

        if (isDetailPage.test(location.pathname)) {
            navigate(`${pathBase}/searches/archive`);
        }
    }

    return (
        <AuthorizedContent object={{ type: 'Interview' }} action="destroy">
            <Modal
                title={t('edit.interviews.delete.title')}
                trigger={t('edit.interviews.delete.title')}
                triggerClassName="flyout-sub-tabs-content-ico-link"
            >
                {(close) => (
                    <DeleteItemForm
                        onSubmit={() => {
                            deleteInterviews();
                            close();
                        }}
                        onCancel={close}
                    >
                        {t('edit.interviews.delete.confirm_text', {
                            archive_ids: selectedArchiveIds.join(', '),
                        })}
                    </DeleteItemForm>
                )}
            </Modal>
        </AuthorizedContent>
    );
}

DeleteInterviews.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};
