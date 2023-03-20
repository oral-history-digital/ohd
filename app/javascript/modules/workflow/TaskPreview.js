import { Component } from 'react';
import {Link} from 'react-router-dom';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';

export default class TaskPreview extends Component {

    dateAttribute() {
        if (this.props.data.user_id === this.props.user.id) {
            // tasks assigned to current user
            if (this.props.data.workflow_state === 'finished') {
                return 'finished_at';
            } else {
                return 'assigned_to_user_at';
            }
        } else if (this.props.data.supervisor_id === this.props.user.id) {
            // tasks assigned to current user as QM
            if (this.props.data.workflow_state === 'cleared') {
                return 'cleared_at';
            } else {
                return 'assigned_to_supervisor_at';
            }
        }
    }

    render() {
        return (
            <div className='base-data box'>
                <p>
                    <Link
                        onClick={() => {
                            this.props.setArchiveId(this.props.data.archive_id);
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.data.archive_id}
                    >
                        {`${this.props.data.archive_id}: ${this.props.data.name[this.props.locale]}`}
                    </Link>
                </p>
                <p className='created-at'>
                    <span className='title'>{t(this.props, `activerecord.attributes.${this.props.scope}.${this.dateAttribute()}`) + ': '}</span>
                    <span className='content'>{this.props.data[this.dateAttribute()]}</span>
                </p>
            </div>
        )
    }

}
