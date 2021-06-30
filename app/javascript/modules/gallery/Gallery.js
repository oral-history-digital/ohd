import PropTypes from 'prop-types';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import CarouselContainer from './CarouselContainer';
import PhotoFormContainer from './PhotoFormContainer';
import photoComparator from './photoComparator';

export default function Gallery({
    interview,
    openArchivePopup,
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
                            <button
                                type="button"
                                key={photo.id}
                                className="Gallery-thumbnail"
                                onClick={() => openArchivePopup({
                                    title: null,
                                    big: true,
                                    content: <CarouselContainer n={index} />
                                })}

                            >
                                <img
                                    className="Gallery-image"
                                    src={photo.thumb_src}
                                    alt=""
                                />
                            </button>
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
    openArchivePopup: PropTypes.func.isRequired,
};
