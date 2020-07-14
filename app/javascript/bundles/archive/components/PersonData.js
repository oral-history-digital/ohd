import React from 'react';
import { t, fullname, getInterviewee, pathBase } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';
import ContentFieldContainer from '../containers/ContentFieldContainer';
//import SingleValueWithFormContainer from '../containers/SingleValueWithFormContainer';
import ArchivePopupButtonContainer from '../containers/ArchivePopupButtonContainer';
import BiographicalEntriesContainer from '../containers/BiographicalEntriesContainer';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class PersonData extends React.Component {

    componentDidMount() {
        this.loadWithAssociations();
    }

    componentDidUpdate() {
        this.loadWithAssociations();
    }

    loadWithAssociations() {
        let interviewee = getInterviewee(this.props);
        if (interviewee && !interviewee.associations_loaded) {
            this.props.fetchData(this.props, 'people', interviewee.id, null, 'with_associations=true');
        }
    }

    existsPublicBiography() {
        let interviewee = getInterviewee(this.props);
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
                    <AuthShowContainer ifAdmin={true} obj={{type: 'BiographicalEntry', action: 'update'}}>
                        {this.biographicalEntries()}
                    </AuthShowContainer>
                </div>
            );
        } else {
            return null;
        }
    }

    biographicalEntries() {
        if(this.props.projectId !== 'dg') {
            let interviewee = getInterviewee(this.props);
            return <BiographicalEntriesContainer person={interviewee} />;
        } else {
            return null;
        }
    }

    personMetadataFields(){
        let _this = this;
        let interviewee = getInterviewee(this.props);
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
                let translation = interviewee.translations.find(t => t.locale === _this.props.locale)
                let value = interviewee[metadataField.name] || (translation && translation[metadataField.name]) || '---';

                let translationsScope = _this.props.translations[_this.props.locale][metadataField.name];
                if (typeof value === 'string' && translationsScope && translationsScope[value])
                    value = t(_this.props, `${metadataField.name}.${value}`)

                return <ContentFieldContainer label={label} value={value} key={`detail-${i}`} />
                //return (
                    //<SingleValueWithFormContainer
                        //metadataField={metadataField}
                        //obj={interviewee}
                    ///>
                //)
            })
        }
    }

    contributionForm() {
        return (
            <ContributionFormContainer 
                contribution={Object.values(this.props.interview.contributions).filter(c => c.contribution_type === 'interviewee')[0]} 
                submitData={this.props.submitData} 
            />
        )
    }

    info() {
        let interviewee = getInterviewee(this.props);
        if (interviewee) {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        <ContentFieldContainer label={t(this.props, 'interviewee_name')} value={fullname(this.props, interviewee, true)} >
                            <AuthShowContainer ifAdmin={true} obj={interviewee}>
                                <ArchivePopupButtonContainer
                                    titleKey='edit.contribution.edit'
                                    buttonFaKey='pencil'
                                    content={this.contributionForm()}
                                />
                            </AuthShowContainer>
                         </ContentFieldContainer>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        <ContentFieldContainer 
                            label={t(this.props, 'interviewee_name')} 
                            value={this.props.project.fullname_on_landing_page ? fullname(this.props, interviewee) : this.props.interview.anonymous_title[this.props.locale]} 
                        />
                    </AuthShowContainer>
                    {this.personMetadataFields()}
                </div>
            );
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
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
