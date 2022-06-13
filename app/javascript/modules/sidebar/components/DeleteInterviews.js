import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getProjectId } from 'modules/archive';
import { deleteData, getProjects } from 'modules/data';
import { Modal } from 'modules/ui';
import { DeleteItemForm } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';

export default function DeleteInterviews({
    selectedArchiveIds,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    function deleteInterviews() {
        selectedArchiveIds.forEach(
            archiveId => dispatch(deleteData({ locale, projectId, projects }, 'interviews', archiveId))
        );

        const isDetailPage = new RegExp(`^${pathBase}/interviews`);

        if (isDetailPage.test(location.pathname)) {
            navigate(`${pathBase}/searches/archive`);
        }
    }

    return (
        <AuthorizedContent object={{ type: 'Interview' }} action='destroy'>
            <Modal
                title={t('edit.interviews.delete.title')}
                trigger={t('edit.interviews.delete.title')}
                triggerClassName="flyout-sub-tabs-content-ico-link"
            >
                {close => (
                    <DeleteItemForm
                        onSubmit={() => {
                            deleteInterviews();
                            close();
                        }}
                        onCancel={close}
                    >
                        {t('edit.interviews.delete.confirm_text', {archive_ids: selectedArchiveIds.join(', ')})}
                    </DeleteItemForm>
                )}
            </Modal>
        </AuthorizedContent>
    );
}

DeleteInterviews.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};
