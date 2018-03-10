import React from 'react';
import Slider from 'react-slick';
import ajax_loader from '../../images/ajax-loader.gif';
import f1 from '../../../images/slick.eot';
import f2 from '../../../images/slick.svg';
import f3 from '../../../images/slick.woff'
import f4 from '../../../images/slick.ttf';
import '../../../css/slick.css';
import '../../../css/slick-theme.css';
import { PROJECT } from '../constants/archiveConstants';

export default class Carousel extends React.Component {

    photoSrc(photo) {
        switch(PROJECT) {
            case 'mog': {
                return '/photos/src/'+photo.src;
                break;
            }
            case 'zwar': {
                 let p = photo.src.split('.')
                 return 'https://medien.cedis.fu-berlin.de/zwar/gallery/' + p[0] + '_original.' + p[1];
                 break;
            }
            default: {
                return null;
            }
         }
    }


    renderPhotos(){
        return this.props.photos.map((photo, index) => {
            return (
                <div key={"slider-image-" + index}
                     className={'slider-image-container'} >
                        <img src={ this.photoSrc(photo) }>
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
