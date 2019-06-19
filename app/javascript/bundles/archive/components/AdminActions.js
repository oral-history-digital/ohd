import React from 'react';
import PropTypes from 'prop-types';
import { t } from '../../../lib/utils';

export default class AdminActions extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    messages() {
        if (Object.keys(this.props.doiResult).length > 0) {
            return Object.keys(this.props.doiResult).map((archiveId) => {
                return (
                    <div>
                        <h4>DOI:</h4>
                        {`${archiveId}: ${this.props.doiResult[archiveId]}`}
                    </div>
                )
            }) 
        }
    }

    deleteInterviews() {
        this.props.archiveIds.forEach((archiveId) => {
            this.props.deleteData('interviews', archiveId);
        });
        this.props.closeArchivePopup();
        this.context.router.history.push(`/${this.props.locale}/searches/archive`);
    }

    exportDOI() {
        this.props.submitDois(this.props.archiveIds, this.props.locale)
        this.props.closeArchivePopup();
    }

    links(archiveIds) {
        return archiveIds.map((archiveId, i) => [
            i > 0 && ", ",
            <a href={`/${this.props.locale}/interviews/${archiveId}/metadata.xml`} target='_blank' key={`link-to-${archiveId}`}>{archiveId}</a>
        ])
    }

    deleteButton() {
        let title = t(this.props, 'delete_interviews.title');
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={title}
            onClick={() => this.props.openArchivePopup({
                title: title,
                content: (
                    <div>
                        {t(this.props, 'delete_interviews.confirm_text', {archive_ids: this.props.archiveIds.join(', ')})}
                        <div className='any-button' onClick={() => this.deleteInterviews()}>
                            {t(this.props, 'delete_interviews.ok')}
                        </div>
                    </div>
                )
            })}
        >
            {title}
        </div>
    }

    doiButton() {
        let title = t(this.props, 'doi.title');
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={title}
            onClick={() => this.props.openArchivePopup({
                title: title,
                content: (
                    <div>
                        {t(this.props, 'doi.text1') + ' '}
                        {this.links(this.props.archiveIds)}
                        {' ' + t(this.props, 'doi.text2')}
                        <div className='any-button' onClick={() => this.exportDOI()}>
                            {t(this.props, 'doi.ok')}
                        </div>
                    </div>
                )
            })}
        >
            {title}
        </div>
    }

    render() {
        return (
            <div>
                {this.messages()}
                {this.doiButton()}
                {this.deleteButton()}
            </div>
        );
    }
}

