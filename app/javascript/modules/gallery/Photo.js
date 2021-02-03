import React from 'react';

import PhotoFormContainer from './PhotoFormContainer';
import { admin } from 'lib/utils';
import { t } from 'modules/i18n';

export default class Photo extends React.Component {

    destroy() {
        this.props.deleteData(this.props, 'interviews', this.props.archiveId, 'photos', this.props.data.id);
        this.props.closeArchivePopup();
    }

    delete() {
        if (admin(this.props, this.props.data)) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'delete'),
                    content: (
                        <div>
                            <div className='any-button' onClick={() => this.destroy()}>
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

    keyPrefix() {
        if (this.props.slider) {
            return 'slider-image-';
        } else {
            return 'photo-';
        }
    }

    caption() {
        let caption = !!(this.props.data.captions[this.props.locale] || this.props.data.captions['de']);
        let photoExplanation = this.props.data.captions[this.props.locale] ? '' : t(this.props, 'activerecord.attributes.photo.caption_explanation');

        if (admin(this.props, this.props.data)) {
            return <PhotoFormContainer photo={this.props.data}/>;
        } else if (caption) {
            return (
                <div className="slider-text">
                    <p className='photo-explanation'>
                        {photoExplanation}
                    </p>
                    <p>
                        {this.props.data.captions[this.props.locale] || this.props.data.captions['de']}
                    </p>
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div
                key={this.keyPrefix() + this.props.data.id}
                className={this.keyPrefix() + 'container'}
            >
                {this.delete()}
                <img src={ this.props.data.src } />
                {this.caption()}
            </div>
        )
    }
}
