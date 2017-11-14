import React from 'react';
import Slider from 'react-slick';


export default class Countries extends React.Component {


    renderPhotos(){
        return this.props.photos.map((photo, index) => {
            return (
                <div key={"slider-image-" + index}
                     className={'slider-image'}
                >
                    <img src={photo.src}>
                    </img>
                </div>
            )
        })
    }

    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <Slider {...settings}>
                {this.renderPhotos()}
            </Slider>
        );
    }
}
