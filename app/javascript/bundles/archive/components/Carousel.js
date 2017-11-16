import React from 'react';
import Slider from 'react-slick';


export default class Carousel extends React.Component {


    renderPhotos(){
        return this.props.photos.map((photo, index) => {
            return (
                <div key={"slider-image-" + index}
                     className={'slider-image-container'} >
                             <div className='slider-image'>
                        <img src={photo.src}>

                        </img>
                    </div>
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
            //autoplay: true
        };
        return (
            <Slider {...settings}>
                {this.renderPhotos()}
            </Slider>
        );
    }
}
