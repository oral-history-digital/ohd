import { Component } from 'react';

import { t } from 'modules/i18n';
import UserContentsContainer from './UserContentsContainer';

export default class Workbook extends Component {
    componentDidMount() {
        if (!this.props.userContentsStatus && this.props.account.email && !this.props.account.error) {
            this.props.fetchData(this.props, 'user_contents');
        }
    }

    render() {
        return (
            <div>
                <UserContentsContainer
                    type='Search'
                    title={t(this.props, 'saved_searches')}
                />
                <UserContentsContainer
                    type='InterviewReference'
                    title={t(this.props, 'saved_interviews')}
                />
                <UserContentsContainer
                    type='UserAnnotation'
                    title={t(this.props, 'saved_annotations')}
                />
            </div>
        );
    }
}
