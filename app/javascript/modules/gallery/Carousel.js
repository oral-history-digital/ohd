import PropTypes from 'prop-types';
import Slider from 'react-slick';

import { useAuthorization } from 'modules/auth';
import Photo from './Photo';
import photoComparator from './photoComparator';

export default function Carousel({ interview, n }) {
    const { isAuthorized } = useAuthorization();

    const photos = Object.values(interview.photos)
        .filter(
            (photo) =>
                photo.workflow_state === 'public' ||
                isAuthorized(photo, 'update')
        )
        .sort(photoComparator);

    return (
        <Slider
            className="Slider Slider--photo"
            dots
            dotsClass="Slider-dots"
            initialSlide={n || 0}
        >
            {photos.map((photo) => (
                <Photo key={photo.id} photo={photo} />
            ))}
        </Slider>
    );
}

Carousel.propTypes = {
    interview: PropTypes.object.isRequired,
    n: PropTypes.number,
};
