import React from 'react';

import UserContentsContainer from '../containers/UserContentsContainer';
import { t } from '../../../lib/utils';

export default class AllUserContents extends React.Component {

    componentDidMount() {
        if (!this.props.status && this.props.account.email) {
            this.props.fetchData('user_contents');
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

