import React from 'react';
import Slider from 'react-slick';


export default class Carousel extends React.Component {


    renderPhotos(){
        return this.props.photos.map((photo, index) => {
            return (
                <div key={"slider-image-" + index}
                     className={'slider-image-container'} >
                        <img src={photo.src}>
                        </img>
                    <div className="slider-text">{photo.captions[this.props.locale]}</div>

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
            slidesToScroll: 1,
            adaptiveHeight: true
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
