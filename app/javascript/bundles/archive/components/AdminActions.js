import React from 'react';
import PropTypes from 'prop-types';
import { t, admin } from '../../../lib/utils';

export default class AdminActions extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    }

    selectedArchiveIds() {
        return this.props.archiveIds.filter(archiveId => archiveId !== 'dummy');
    }

    doiResults() {
        if (Object.keys(this.props.doiResult).length > 0) {
            return <h4>DOI Status:</h4> + Object.keys(this.props.doiResult).map((archiveId) => {
                return (
                    <div key={`doi-result-${archiveId}`}>
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
                    <div key={`admin-action-message-${archiveId}`}>
                        {`${archiveId}: ${this.props.statuses[archiveId]}`}
                    </div>
                )
            }
        })
    }

    deleteInterviews() {
        this.selectedArchiveIds().forEach((archiveId) => {
            this.props.deleteData(this.props, 'interviews', archiveId);
        });
        this.props.closeArchivePopup();
        if (this.props.match.params.archiveId === undefined) {
            // TODO: faster aproach would be to just hide or delete the dom-elements
            location.reload();
        } else {
            this.props.history.push(`/${this.props.locale}/searches/archive`);
        }
    }

    updateInterviews(params) {
        this.selectedArchiveIds().forEach((archiveId) => {
            let updatedParams = Object.assign({}, params, {id: archiveId});
            this.props.submitData(this.props, {interview: updatedParams});
        });
        this.props.closeArchivePopup();
        if (this.props.match.params.archiveId === undefined) {
            // TODO: faster aproach would be to just hide or delete the dom-elements
            location.reload();
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
        if (admin(this.props, {type: 'Interview', action: 'destroy'})) {
            let title = t(this.props, 'edit.interviews.delete.title');
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={title}
                onClick={() => this.props.openArchivePopup({
                    title: title,
                    content: (
                        <div>
                            {t(this.props, 'edit.interviews.delete.confirm_text', {archive_ids: this.selectedArchiveIds().join(', ')})}
                            <div className='any-button' onClick={() => this.deleteInterviews()}>
                                {t(this.props, 'submit')}
                            </div>
                        </div>
                    )
                })}
            >
                {title}
            </div>
        }
    }

    updateButton(params, action) {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            let title = t(this.props, `edit.interviews.${action}.title`);
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={title}
                onClick={() => this.props.openArchivePopup({
                    title: title,
                    content: (
                        <div>
                            {t(this.props, `edit.interviews.${action}.confirm_text`, {archive_ids: this.selectedArchiveIds().join(', ')})}
                            <div className='any-button' onClick={() => this.updateInterviews(params)}>
                                {t(this.props, 'submit')}
                            </div>
                        </div>
                    )
                })}
            >
                {title}
            </div>
        }
    }

    doiButton() {
        if (admin(this.props, {type: 'Interview', action: 'dois'})) {
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
    }

    reset() {
        return <a onClick={() => { this.props.addRemoveArchiveId(-1)} }> {t(this.props, 'reset')}</a>;
    }

    setAll() {
        return <a onClick={() => { this.props.setArchiveIds(Object.values(this.props.archiveSearchResults.map(i =>  i.archive_id)))} }> {t(this.props, 'set_all')}</a>;
    }

    render() {
        return (
            <div>
                {this.doiResults()}
                {this.doiButton()}
                {this.messages()}
                {this.deleteButton()}
                {this.updateButton({workflow_state: 'public'}, 'publish')}
                {this.updateButton({workflow_state: 'unshared'}, 'unpublish')}
                {this.updateButton({biographies_workflow_state: 'public'}, 'publish_biographies')}
                {this.updateButton({biographies_workflow_state: 'unshared'}, 'unpublish_biographies')}
                {this.reset()}
                {this.setAll()}
            </div>
        );
    }
}
