import React from 'react';
import CarouselContainer from '../containers/CarouselContainer';


export default class Gallery extends React.Component {

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
                    <img src={photo.thumb}>
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
