import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import PhotoFormContainer from './PhotoFormContainer';

export default function PhotoAdminButtons({
    photo,
    archiveId,
    locale,
    projectId,
    projects,
    deleteData,
}) {
    const { t } = useI18n();

    const destroy = () => deleteData({ locale, projectId, projects }, 'interviews', archiveId, 'photos', photo.id);

    return (
        <AuthorizedContent object={photo} action='update'>
            <div className="PhotoAdminButtons">
                <Modal
                    title={t('edit.photo.edit')}
                    trigger={<FaPencilAlt />}
                    triggerClassName="PhotoAdminButtons-edit"
                >
                    {closeModal => (
                        <PhotoFormContainer
                            photo={photo}
                            onSubmit={closeModal} />
                    )}
                </Modal>
                <Modal
                    title={t('edit.photo.delete')}
                    trigger={<FaTrash />}
                >
                    {closeModal => (
                        <div>
                            <button
                                type="button"
                                className="Button any-button"
                                onClick={() => { destroy(); closeModal(); }}
                            >
                                {t('delete')}
                            </button>
                        </div>
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
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
