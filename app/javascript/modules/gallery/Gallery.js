import { Component } from 'react';
import PropTypes from 'prop-types';

import { admin, AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import CarouselContainer from './CarouselContainer';
import PhotoFormContainer from './PhotoFormContainer';
import styles from './Gallery.module.scss';

export default class Gallery extends Component {
    renderPhotos() {
        let photos = [];
        let n = 0;
        if (
            this.props.interview && this.props.interview.photos
        ) {
            for (var c in this.props.interview.photos) {
                let photo = this.props.interview.photos[c];
                if (photo.workflow_state === 'public' || admin(this.props, photo, 'show')) {
                    photos.push(this.photo(photo, n));
                    n+=1;
                }
            }
        }
        if (photos.length > 0) {
            return (
                <div className={styles.gallery}>
                    {photos}
                </div>
            )
        } else {
            return null;
        }
    }

    photo(photo, n) {
        return (
            <button
                type="button"
                key={photo.id}
                className={styles.thumbnail}
                onClick={() => this.props.openArchivePopup({
                    title: null,
                    big: true,
                    content: <CarouselContainer n={n} />
                })}

            >
                <img
                    className={styles.image}
                    src={photo.thumb_src}
                />
            </button>
        )
    }

    addPhoto() {
        return (
            <AuthorizedContent object={{ type: 'Photo', interview_id: this.props.interview.id }} action='create'>
                <Modal
                    title={t(this.props, 'edit.photo.new')}
                    trigger={<i className="fa fa-plus"></i>}
                >
                    {
                        closeModal => (
                            <PhotoFormContainer
                                interview={this.props.interview}
                                withUpload
                                onSubmit={closeModal}
                            />
                        )
                    }
                </Modal>
            </AuthorizedContent>
        );
    }

    render() {
        let explanation = this.props.interview.photos && Object.keys(this.props.interview.photos).length > 0 ? 'interview_gallery_explanation' : 'interview_empty_gallery_explanation'
        return (
            <div>
                <div className='explanation'>{t(this.props, explanation)}</div>
                {this.renderPhotos()}
                {this.addPhoto()}
            </div>
        );
    }
}

Gallery.propTypes = {
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
};
