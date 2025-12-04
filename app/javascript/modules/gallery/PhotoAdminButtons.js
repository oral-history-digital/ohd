import { AuthorizedContent } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import PhotoFormContainer from './PhotoFormContainer';

export default function PhotoAdminButtons({
    photo,
    archiveId,
    locale,
    projectId,
    project,
    deleteData,
}) {
    const { t } = useI18n();

    const destroy = () =>
        deleteData(
            { locale, projectId, project },
            'interviews',
            archiveId,
            'photos',
            photo.id
        );

    return (
        <AuthorizedContent object={photo} action="update">
            <div className="PhotoAdminButtons">
                <Modal
                    title={t('edit.photo.edit')}
                    trigger={<FaPencilAlt />}
                    triggerClassName="PhotoAdminButtons-edit"
                >
                    {(closeModal) => (
                        <PhotoFormContainer
                            photo={photo}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                <Modal title={t('edit.photo.delete')} trigger={<FaTrash />}>
                    {(closeModal) => (
                        <DeleteItemForm
                            onSubmit={() => {
                                destroy();
                                closeModal();
                            }}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </div>
        </AuthorizedContent>
    );
}

PhotoAdminButtons.propTypes = {
    photo: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
