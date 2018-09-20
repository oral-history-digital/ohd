import React from 'react';
import Slider from 'react-slick';
import PhotoFormContainer from '../containers/PhotoFormContainer';
import { t, admin } from '../../../lib/utils';

import '../../../css/slick.css';
import '../../../css/slick-theme.css';

export default class Carousel extends React.Component {

    photoSrc(photo) {
        //switch(this.props.project) {
            //case 'mog': {
                //return '/photos/src/'+photo.src;
                //break;
            //}
            //case 'zwar': {
                 //let p = photo.src.split('.')
                 //return 'https://medien.cedis.fu-berlin.de/zwar/gallery/' + p[0] + '_original.' + p[1];
                 //break;
            //}
            //default: {
                //return null;
            //}
         //}
        return photo.src;
    }

    caption(photo) {
        if (admin(this.props)) {
            return <PhotoFormContainer photo={photo}/>;
        } else {
            return photo.captions[this.props.locale]
        }
    }

    destroy(photo) {
        this.props.deleteData('interviews', this.props.archiveId, 'photos', photo.id);
        this.props.closeArchivePopup();
    }

    delete(photo) {
        if (admin(this.props)) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'delete'),
                    content: (
                        <div>
                            <div className='any-button' onClick={() => this.destroy(photo)}>
                                {t(this.props, 'delete')}
                            </div>
                        </div>
                    )
                })}
            >
                <i className="fa fa-trash-o"></i>
            </div>
        }
    }

    renderPhotos() {
        let photos = [];
        if (
            this.props.interview 
        ) {
            for (var c in this.props.interview.photos) {
                let photo = this.props.interview.photos[c];
                if (photo !== 'fetched') {
                    photos.push(this.photo(photo));
                }
            }
        } 
        return photos;
    }

    photo(photo){
        return (
            <div 
                key={"slider-image-" + photo.id}
                className={'slider-image-container'} 
            >
                <img src={ this.photoSrc(photo) } />
                <div className="slider-text">{this.caption(photo)}</div>
                {this.delete(photo)}
            </div>
        )
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
