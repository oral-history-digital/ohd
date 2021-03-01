import React from 'react';
import PropTypes from 'prop-types';

import { ContentField } from 'modules/forms';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { Modal } from 'modules/ui';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { humanReadable } from 'modules/data';
import { fullname } from 'modules/people';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import BiographicalEntriesContainer from './BiographicalEntriesContainer';

export default class PersonData extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.loadWithAssociations();
    }

    componentDidUpdate() {
        this.loadWithAssociations();
    }

    loadWithAssociations() {
        const { interviewee } = this.props;

        if (interviewee && !interviewee.associations_loaded) {
            this.props.fetchData(this.props, 'people', interviewee.id, null, 'with_associations=true');
        }
    }

    existsPublicBiography() {
        const { interviewee } = this.props;

        if (interviewee && interviewee.associations_loaded) {
            let firstKey = interviewee && Object.keys(interviewee.biographical_entries)[0];
            let firstEntry = interviewee && interviewee.biographical_entries[firstKey];
            return !!firstKey && firstEntry.workflow_state === 'public' && firstEntry;
        } else {
            return false;
        }
    }

    download(lang) {
        return (
            <a href={pathBase(this.props) + '/biographical_entries/' + this.props.archiveId + '.pdf?lang=' + lang}>
                <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                <span>{t(this.props, lang)}</span>
            </a>
        )
    }

    downloads(){
        let publicBioEntry = this.existsPublicBiography();
        if (publicBioEntry) {
            return (
                <span>
                    {publicBioEntry.text[this.props.interview.lang] && this.download(this.props.interview.lang)}
                    {publicBioEntry.text[this.props.locale] &&
                            this.props.interview.lang !== this.props.locale &&
                            this.download(this.props.locale)
                    }
                </span>
            )
        } else {
            return '---';
        }
    }

    history() {
        if(this.props.projectId !== 'dg') {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        <p>
                            <span className="flyout-content-label">
                                {t(this.props, "history")}:
                            </span>
                            {this.downloads()}
                        </p>
                    </AuthShowContainer>
                    {this.biographicalEntries()}
                </div>
            );
        } else {
            return null;
        }
    }

    biographicalEntries() {
        if(this.props.projectId !== 'dg') {
            return (
                <AuthorizedContent object={{type: 'BiographicalEntry', action: 'create', interview_id: this.props.interview && this.props.interview.id}} >
                    <BiographicalEntriesContainer />;
                </AuthorizedContent>
            )
        } else {
            return null;
        }
    }

    // metadata-fields with source 'Person' only here!!!
    //
    // metadata-fields with ref_obj_type 'Person' will be shown in <SelectedRegistryReferencesContainer refObject={this.props.interviewee} />
    // in FlyoutTabs
    //
    personMetadataFields(){
        const { interviewee } = this.props;

        let _this = this;

        if (interviewee && interviewee.associations_loaded) {

            return Object.values(this.props.project.metadata_fields).filter(m => {
                return (m.source === 'Person' &&
                    (
                        (_this.props.isLoggedIn && m.use_in_details_view) ||
                        (!_this.props.isLoggedIn && m.display_on_landing_page)
                    )
                )
            }).map(function(metadataField, i){
                let label = metadataField.label && metadataField.label[_this.props.locale] || t(_this.props, metadataField.name);
                let value = humanReadable(interviewee, metadataField.name, _this.props, _this.state);

                return <ContentField label={label} value={value} key={`detail-${i}`} />
            })
        }
    }

    info() {
        const { interviewee } = this.props;

        return (
            <div>
                <AuthShowContainer ifLoggedIn={true}>
                    <ContentField label={t(this.props, 'interviewee_name')} value={fullname(this.props, interviewee, true)} >
                        <AuthorizedContent object={interviewee}>
                            <Modal
                                title={t(this.props, 'edit.contribution.edit')}
                                trigger={<><i className="fa fa-pencil" />{t(this.props, 'edit.contribution.edit')}</>}
                            >
                                {close => (
                                    <ContributionFormContainer
                                        contribution={Object.values(this.props.interview.contributions).filter(c => c.contribution_type === 'interviewee')[0]}
                                        interview={this.props.interview}
                                        withSpeakerDesignation
                                        onSubmit={close}
                                    />
                                )}
                            </Modal>
                        </AuthorizedContent>
                    </ContentField>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    <ContentField
                        label={t(this.props, 'interviewee_name')}
                        value={this.props.project.fullname_on_landing_page ? fullname(this.props, interviewee) : this.props.interview.anonymous_title[this.props.locale]}
                    />
                </AuthShowContainer>
                {this.personMetadataFields()}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.info()}
                {this.history()}
            </div>
        );
    }
}

PersonData.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
