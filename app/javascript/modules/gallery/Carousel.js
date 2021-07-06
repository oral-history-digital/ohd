import PropTypes from 'prop-types';
import Slider from 'react-slick';

import PhotoContainer from './PhotoContainer';
import { useAuthorization } from 'modules/auth';
import photoComparator from './photoComparator';

export default function Carousel({
    interview,
    n,
})
{
    const { isAuthorized } = useAuthorization();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        initialSlide: n || 0,
    };

    const photos = Object.values(interview.photos)
        .filter(photo => photo.workflow_state === 'public' || isAuthorized(photo, 'show'))
        .sort(photoComparator);

    return (
        <Slider {...settings}>
            {
                photos.map(photo => <PhotoContainer key={photo.id} data={photo} />)
            }
        </Slider>
    );
}

Carousel.propTypes = {
    interview: PropTypes.object.isRequired,
    n: PropTypes.number,
};
