import React from 'react';
import ArchiveUtils from '../../../lib/utils';

export default class UserContentDelete extends React.Component {

    destroy() {
        this.props.deleteUserContent(this.props.id);
        this.props.closeArchivePopup();
    }

    cancel() {
        this.props.closeArchivePopup();
    }

    render() {
        return (
            <div>
                <p>{ArchiveUtils.translate(this.props, 'title')}:</p>
                <p>{this.props.title}</p>
                <p>{ArchiveUtils.translate(this.props, 'description')}:</p>
                <p>{this.props.description}</p>
                <div className='any-button' onClick={() => this.destroy()}>
                    {ArchiveUtils.translate(this.props, 'delete')}
                </div>
            </div>
        );
    }
}
