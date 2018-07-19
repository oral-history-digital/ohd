import React from 'react';
import { t } from '../../../lib/utils';

export default class UserContentDelete extends React.Component {

    destroy() {
        this.props.deleteData('user_contents', this.props.id);
        this.props.closeArchivePopup();
    }

    render() {
        return (
            <div>
                <p>{t(this.props, 'title')}:
                    <span>{this.props.title}</span>
                </p>
                <p>{t(this.props, 'description')}:
                    <span>{this.props.description}</span>
                </p>
                <div className='any-button' onClick={() => this.destroy()}>
                    {t(this.props, 'delete')}
                </div>
            </div>
        );
    }
}
