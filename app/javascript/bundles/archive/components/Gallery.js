import React from 'react';
import CarouselContainer from '../containers/CarouselContainer';
import { PROJECT } from '../constants/archiveConstants'

export default class Gallery extends React.Component {

    thumbnailSrc(photo) {
        switch(PROJECT) {
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

        return this.props.photos.map((photo, index) => {
            return (
                <div key={"photo-" + index}
                     className={'thumbnail'}
                     onClick={() => this.props.openArchivePopup({
                         title: null,
                         big: true,
                         content: <CarouselContainer/>
                     })}

                >
                    <img src={ this.thumbnailSrc(photo) }>
                    </img>
                </div>
            )
        })

    }


    render() {
        return (
            <div className={'img-gallery'}>
                {this.renderPhotos()}
            </div>
        );
    }
}
