import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { t } from '../../../lib/utils';

export default class AdminActions extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    selectedArchiveIds() {
        return this.props.archiveIds.filter(archiveId => archiveId !== 'dummy');
    }

    doiResults() {
        if (Object.keys(this.props.doiResult).length > 0) {
            return <h4>DOI Status:</h4> + Object.keys(this.props.doiResult).map((archiveId) => {
                return (
                    <div>
                        {`${archiveId}: ${this.props.doiResult[archiveId]}`}
                    </div>
                )
            }) 
        } 
    }

    messages() {
        return this.selectedArchiveIds().map((archiveId) => {
            if (this.props.statuses[archiveId] !== undefined) {
                return (
                    <div>
                        {`${archiveId}: ${this.props.statuses[archiveId]}`}
                    </div>
                )
            }
        })
    }

    deleteInterviews() {
        this.selectedArchiveIds().forEach((archiveId) => {
            this.props.deleteData('interviews', archiveId);
        });
        this.props.closeArchivePopup();
        if (this.context.router.route.match.params.archiveId === undefined) {
            // TODO: faster aproach would be to just hide or delete the dom-elements 
            location.reload();
        } else {
            this.context.router.history.push(`/${this.props.locale}/searches/archive`);
        }
    }

    exportDOI() {
        this.props.submitDois(this.selectedArchiveIds(), this.props.locale)
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
                        {t(this.props, 'delete_interviews.confirm_text', {archive_ids: this.selectedArchiveIds().join(', ')})}
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
                        {this.links(this.selectedArchiveIds())}
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

    reset() {
        return <a onClick={() => { this.props.addRemoveArchiveId(-1)} }> {t(this.props, 'reset')}</a>;
    }

    setAll() {
        return <a onClick={() => { this.props.setArchiveIds(Object.keys(this.props.archiveSearchResults))} }> {t(this.props, 'set_all')}</a>;
    }

    render() {
        return (
            <div>
                {this.doiResults()}
                {this.doiButton()}
                {this.messages()}
                {this.deleteButton()}
                {this.reset()}
                {this.setAll()}
            </div>
        );
    }
}

