import React from 'react';
import Slider from 'react-slick';

import PhotoContainer from './PhotoContainer';
import { admin } from 'lib/utils';

export default class Carousel extends React.Component {
    renderPhotos() {
        let photos = [];
        if (
            this.props.interview
        ) {
            for (var c in this.props.interview.photos) {
                let photo = this.props.interview.photos[c];
                if (photo.workflow_state === 'public' || admin(this.props, photo)) {
                    photos.push(<PhotoContainer data={photo} />);
                }
            }
        }
        return photos;
    }

    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            initialSlide: this.props.n || 0,
            //variableWidth: true
            //centerMode: true
            //autoplay: true
        };
        return (
            <Slider {...settings}>
                {this.renderPhotos()}
            </Slider>
        );
    }
}
