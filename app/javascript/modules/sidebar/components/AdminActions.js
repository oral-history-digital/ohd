import { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';

import DeleteInterviews from './DeleteInterviews';
import UpdateInterviews from './UpdateInterviews';
import SubmitInterviewIds from './SubmitInterviewIds';

export default class AdminActions extends Component {
    selectedArchiveIds() {
        return this.props.archiveIds.filter(archiveId => archiveId !== 'dummy');
    }

    doiResults() {
        if (Object.keys(this.props.doiResult).length > 0) {
            return <h4>DOI Status:</h4> + Object.keys(this.props.doiResult).map((archiveId) => {
                return (
                    <div key={archiveId}>
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
                    <div key={archiveId}>
                        {`${archiveId}: ${this.props.statuses[archiveId]}`}
                    </div>
                )
            }
        })
    }

    metadataLinks(archiveIds) {
        return archiveIds.map((archiveId, i) => [
            i > 0 && ", ",
            <a href={`/${pathBase(this.props)}/interviews/${archiveId}/metadata.xml`} target='_blank' rel="noreferrer" key={`link-to-${archiveId}`}>{archiveId}</a>
        ])
    }

    doiText() {
        return (
            <AuthorizedContent object={{type: 'Interview'}} action='dois'>
                <Modal
                    title={t(this.props, 'doi.title')}
                    trigger={t(this.props, 'doi.title')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <form className="Form">
                            {t(this.props, 'doi.text1') + ' '}
                            {this.metadataLinks(this.selectedArchiveIds())}
                            {' ' + t(this.props, 'doi.text2')}

                            <div className="Form-footer u-mt">
                                <button
                                    type="button"
                                    className="Button Button--primaryAction"
                                    onClick={() => {
                                        this.exportDOI();
                                        close();
                                    }}
                                >
                                    {t(this.props, 'doi.ok')}
                                </button>
                                <button
                                    type="button"
                                    className="Button Button--secondaryAction"
                                    onClick={close}
                                >
                                    {t(this.props, 'cancel')}
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            </AuthorizedContent>
        );
    }

    render() {
        const { archiveSearchResults, setArchiveIds } = this.props;

        const selectedArchiveIds = this.selectedArchiveIds();

        return (
            <div>
                {this.doiResults()}

                <AuthorizedContent object={{type: 'Interview'}} action='dois'>
                    <SubmitInterviewIds
                        selectedArchiveIds={selectedArchiveIds}
                        action='dois'
                        confirmText={this.doiText()}
                    />
                </AuthorizedContent>
                <AuthorizedContent object={{ type: 'Interview' }} action='update'>
                    <SubmitInterviewIds
                        selectedArchiveIds={selectedArchiveIds}
                        action='export_photos'
                        filename='photos.zip'
                    />
                </AuthorizedContent>

                {this.messages()}

                <DeleteInterviews selectedArchiveIds={selectedArchiveIds} />

                <AuthorizedContent object={{ type: 'Interview' }} action='update'>
                    <UpdateInterviews
                        selectedArchiveIds={selectedArchiveIds}
                        params={{workflow_state: 'public'}}
                        action="publish"
                    />
                    <UpdateInterviews
                        selectedArchiveIds={selectedArchiveIds}
                        params={{workflow_state: 'unshared'}}
                        action="unpublish"
                    />
                    <UpdateInterviews
                        selectedArchiveIds={selectedArchiveIds}
                        params={{biographies_workflow_state: 'public'}}
                        action="publish_biographies"
                    />
                    <UpdateInterviews
                        selectedArchiveIds={selectedArchiveIds}
                        params={{biographies_workflow_state: 'unshared'}}
                        action="publish_biographies"
                    />
                </AuthorizedContent>

                <button
                    type="button"
                    className="Button"
                    onClick={() => { this.props.addRemoveArchiveId(-1); }}
                >
                    {t(this.props, 'reset')}
                </button>
                <button
                    type="button"
                    className="Button"
                    onClick={() => setArchiveIds(archiveSearchResults.map(i => i.archive_id))}
                >
                    {t(this.props, 'set_all')}
                </button>
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
    setArchiveIds: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    submitSelectedArchiveIds: PropTypes.func.isRequired,
};
