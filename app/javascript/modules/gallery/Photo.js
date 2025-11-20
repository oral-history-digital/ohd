import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import PhotoAdminButtonsContainer from './PhotoAdminButtonsContainer';
import PhotoCaption from './PhotoCaption';

export default function Photo({ photo }) {
    const { locale } = useI18n();

    function handleContextMenu(event) {
        event.preventDefault();
    }

    return (
        <div className="PhotoSlide">
            <div className="PhotoSlide-photo">
                <img
                    className="PhotoSlide-image"
                    src={photo.src}
                    alt={photo.captions[locale] || photo.captions['de']}
                    onContextMenu={handleContextMenu}
                />
            </div>

            <div className="PhotoSlide-text">
                <PhotoAdminButtonsContainer photo={photo} />
                <PhotoCaption photo={photo} />
            </div>
        </div>
    );
}

Photo.propTypes = {
    photo: PropTypes.object.isRequired,
};
