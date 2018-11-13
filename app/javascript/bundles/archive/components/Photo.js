import React from 'react';
import { t, admin } from '../../../lib/utils';

export default class Photo extends React.Component {

    thumbnailSrc(photo) {
        //switch(this.props.project) {
           //case 'mog': {
               //return '/photos/thumb/' + photo.src;
               //break;
           //}
           //case 'zwar': {
                //let p = photo.src.split('.')
                //return 'https://medien.cedis.fu-berlin.de/zwar/gallery/' + p[0] + '_thumb.' + p[1];
                //break;
           //}
           //default: {
               //return null;
           //}
        //}
        return photo.thumb_src;
    }

    render() {
        return (
            <div key={"photo-" + this.props.data.id} >
                <img src={ this.thumbnailSrc(this.props.data) } />
                <div className='caption'>
                    {this.props.data.text[this.props.locale]}
                </div>
            </div>
        )
    }
}
