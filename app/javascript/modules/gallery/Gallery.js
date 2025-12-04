import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal, PhotoModal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaExpandAlt, FaPlus } from 'react-icons/fa';

import CarouselContainer from './CarouselContainer';
import PhotoFormContainer from './PhotoFormContainer';
import photoComparator from './photoComparator';

export default function Gallery({ interview }) {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();

    function handleContextMenu(event) {
        event.preventDefault();
    }

    let visiblePhotos = [];
    if (interview.photos) {
        visiblePhotos = Object.values(interview.photos)
            .filter(
                (photo) =>
                    photo.workflow_state === 'public' ||
                    isAuthorized(photo, 'update')
            )
            .sort(photoComparator);
    }

    return (
        <div>
            {visiblePhotos.length > 0 && (
                <div className="Gallery">
                    {visiblePhotos.map((photo, index) => (
                        <PhotoModal
                            key={photo.id}
                            trigger={
                                <>
                                    <FaExpandAlt className="Gallery-icon" />
                                    <img
                                        className="Gallery-image"
                                        src={photo.thumb_src}
                                        alt=""
                                        onContextMenu={handleContextMenu}
                                    />
                                </>
                            }
                            triggerClassName="Gallery-button"
                        >
                            <CarouselContainer n={index} />
                        </PhotoModal>
                    ))}
                </div>
            )}

            <AuthorizedContent
                object={{ type: 'Photo', interview_id: interview.id }}
                action="create"
            >
                <Modal
                    title={t('edit.photo.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {(closeModal) => (
                        <PhotoFormContainer
                            interview={interview}
                            withUpload
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        </div>
    );
}

Gallery.propTypes = {
    interview: PropTypes.object.isRequired,
};
