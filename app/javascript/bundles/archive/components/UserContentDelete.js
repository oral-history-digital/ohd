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
                <p>{ArchiveUtils.translate(this.props, 'title')}:
                    <span>{this.props.title}</span>
                </p>
                <p>{ArchiveUtils.translate(this.props, 'description')}:
                    <span>{this.props.description}</span>
                </p>
                <div className='any-button' onClick={() => this.destroy()}>
                    {ArchiveUtils.translate(this.props, 'delete')}
                </div>
            </div>
        );
    }
}
