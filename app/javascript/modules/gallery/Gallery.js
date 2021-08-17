import PropTypes from 'prop-types';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal, PhotoModal } from 'modules/ui';
import CarouselContainer from './CarouselContainer';
import PhotoFormContainer from './PhotoFormContainer';
import photoComparator from './photoComparator';

export default function Gallery({
    interview,
}) {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();

    let visiblePhotos = [];
    if (interview.photos) {
        visiblePhotos = Object.values(interview.photos)
            .filter(photo => photo.workflow_state === 'public' || isAuthorized(photo, 'show'))
            .sort(photoComparator);
    }

    return (
        <div>
            <div className="explanation">
                {t(visiblePhotos.length > 0 ? 'interview_gallery_explanation' : 'interview_empty_gallery_explanation')}
            </div>

            {
                visiblePhotos.length > 0 && (
                    <div className="Gallery">
                        {visiblePhotos.map((photo, index) => (
                            <PhotoModal
                                key={photo.id}
                                trigger={<img className="Gallery-image" src={photo.thumb_src} alt="" />}
                                triggerClassName="Gallery-thumbnail"
                            >
                                <CarouselContainer n={index} />
                            </PhotoModal>
                        ))}
                    </div>
                )
            }

            <AuthorizedContent object={{ type: 'Photo', interview_id: interview.id }} action='create'>
                <Modal
                    title={t('edit.photo.new')}
                    trigger={<i className="fa fa-plus"></i>}
                >
                    {
                        closeModal => (
                            <PhotoFormContainer
                                interview={interview}
                                withUpload
                                onSubmit={closeModal}
                            />
                        )
                    }
                </Modal>
            </AuthorizedContent>
        </div>
    );
}

Gallery.propTypes = {
    interview: PropTypes.object.isRequired,
};
