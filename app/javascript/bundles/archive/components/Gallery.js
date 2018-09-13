import React from 'react';
import CarouselContainer from '../containers/CarouselContainer';
import PhotoFormContainer from '../containers/PhotoFormContainer';
import { t, admin } from '../../../lib/utils';

export default class Gallery extends React.Component {

    thumbnailSrc(photo) {
        switch(this.props.project) {
           case 'mog': {
               return '/photos/thumb/' + photo.src;
               break;
           }
           case 'zwar': {
                let p = photo.src.split('.')
                return 'https://medien.cedis.fu-berlin.de/zwar/gallery/' + p[0] + '_thumb.' + p[1];
                break;
           }
           default: {
               return null;
           }
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

    photo(photo) {
        return (
            <div key={"photo-" + photo.id}
                 className={'thumbnail'}
                 onClick={() => this.props.openArchivePopup({
                     title: null,
                     big: true,
                     content: <CarouselContainer/>
                 })}

            >
                <img src={ this.thumbnailSrc(photo) } />
            </div>
        )
    }

    addPhoto() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.photo.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.photo.new'),
                        content: <PhotoFormContainer 
                            interview={this.props.interview} 
                            withUpload={true}
                        />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className='explanation'>{t(this.props, 'interview_gallery_explanation')}</div>
                <div className={'img-gallery'}>
                    {this.renderPhotos()}
                    {this.addPhoto()}
                </div>
            </div>
        );
    }
}
