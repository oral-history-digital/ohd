import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { pathBase } from 'modules/routes';
import { AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';

export default class AdminActions extends React.Component {
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
        if (this.props.match.params.archiveId === undefined) {
            // TODO: faster aproach would be to just hide or delete the dom-elements
            location.reload();
        } else {
            this.props.history.push(`/${pathBase(this.props)}/searches/archive`);
        }
    }

    updateInterviews(params) {
        this.selectedArchiveIds().forEach((archiveId) => {
            let updatedParams = Object.assign({}, params, {id: archiveId});
            this.props.submitData(this.props, {interview: updatedParams});
        });
        if (this.props.match.params.archiveId === undefined) {
            // TODO: faster aproach would be to just hide or delete the dom-elements
            location.reload();
        }
    }

    exportDOI() {
        this.props.submitDois(this.selectedArchiveIds(), this.props.locale)
    }

    links(archiveIds) {
        return archiveIds.map((archiveId, i) => [
            i > 0 && ", ",
            <a href={`/${this.props.locale}/interviews/${archiveId}/metadata.xml`} target='_blank' key={`link-to-${archiveId}`}>{archiveId}</a>
        ])
    }

    deleteButton() {
        return (
            <AuthorizedContent object={{ type: 'Interview', action: 'destroy' }}>
                <Modal
                    title={t(this.props, 'edit.interviews.delete.title')}
                    trigger={t(this.props, 'edit.interviews.delete.title')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <div>
                            {t(this.props, 'edit.interviews.delete.confirm_text', {archive_ids: this.selectedArchiveIds().join(', ')})}

                            <button
                                type="button"
                                className="any-button"
                                onClick={() => {
                                    this.deleteInterviews();
                                    close();
                                }}
                            >
                                {t(this.props, 'submit')}
                            </button>
                        </div>
                    )}
                </Modal>
            </AuthorizedContent>
        );
    }

    updateButton(params, action) {
        return (
            <AuthorizedContent object={{ type: 'Interview', action: 'update' }}>
                <Modal
                    title={t(this.props, `edit.interviews.${action}.title`)}
                    trigger={t(this.props, `edit.interviews.${action}.title`)}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <div>
                            {t(this.props, `edit.interviews.${action}.confirm_text`, {archive_ids: this.selectedArchiveIds().join(', ')})}

                            <button
                                type="button"
                                className="any-button"
                                onClick={() => {
                                    this.updateInterviews(params);
                                    close();
                                }}
                            >
                                {t(this.props, 'submit')}
                            </button>
                        </div>
                    )}
                </Modal>
            </AuthorizedContent>
        );
    }

    doiButton() {
        return (
            <AuthorizedContent object={{type: 'Interview', action: 'dois'}}>
                <Modal
                    title={t(this.props, 'doi.title')}
                    trigger={t(this.props, 'doi.title')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <div>
                            {t(this.props, 'doi.text1') + ' '}
                            {this.links(this.selectedArchiveIds())}
                            {' ' + t(this.props, 'doi.text2')}

                            <button
                                type="button"
                                className="any-button"
                                onClick={() => {
                                    this.exportDOI();
                                    close();
                                }}
                            >
                                {t(this.props, 'doi.ok')}
                            </button>
                        </div>
                    )}
                </Modal>
            </AuthorizedContent>
        );
    }

    reset() {
        return (
            <button
                type="button"
                onClick={() => { this.props.addRemoveArchiveId(-1); }}
            >
                {t(this.props, 'reset')}
            </button>
        );
    }

    setAll() {
        return (
            <button
                type="button"
                onClick={() => { this.props.setArchiveIds(Object.values(this.props.archiveSearchResults.map(i =>  i.archive_id))); }}
            >
                {t(this.props, 'set_all')}
            </button>
        );
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

AdminActions.propTypes = {
    archiveSearchResults: PropTypes.array,
    archiveIds: PropTypes.array,
    doiResult: PropTypes.object,
    statuses: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setArchiveIds: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    submitDois: PropTypes.func.isRequired,
};