import React from 'react';
import { t, fullname, getInterviewee, contentField, pathBase } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';
import PersonFormContainer from '../containers/PersonFormContainer';
import BiographicalEntriesContainer from '../containers/BiographicalEntriesContainer';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class PersonData extends React.Component {

    // typologies(){
    //     let interviewee = getInterviewee(this.props);
    //     if (interviewee.typology && interviewee.typology[this.props.locale]){
    //         return contentField(t(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '),"" );
    //     } else {
    //         return "";
    //     }
    // }

    existsPublicBiography() {
        let interviewee = getInterviewee(this.props);
        let firstKey = interviewee && Object.keys(interviewee.biographical_entries)[0];
        let firstEntry = interviewee && interviewee.biographical_entries[firstKey];
        return !!firstKey && firstEntry.workflow_state === 'public' && firstEntry;
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
            return (
                <div>
                    <BiographicalEntriesContainer person={interviewee} />
                </div>
            )
        } else {
            return null;
        }
    }

    detailViewFields(){
        let _this = this;
        let interviewee = getInterviewee(_this.props);
        return this.props.detailViewFields.map(function(datum, i){
            // This is the PersonData-component!! So is it right to show metadataFields whithout source === 'Person' here?
            if (datum.source === 'Person'){
                let label = datum.label && datum.label[_this.props.locale] || t(_this.props, datum.name);
                let value = interviewee[datum.name] || '---';
                if (typeof value === 'string' && !/\d{2,4}/.test(value)) // try to not translate dates
                    value = t(_this.props, `${datum.name}.${value}`)
                if (typeof value === 'object' && value !== null)
                    value = value[_this.props.locale]
                if (Array.isArray(value)){ value = value.join(", ") } //this is needed for mog and probably all other projects
                if (typeof value === "object" || typeof value === "undefined"){ value = "" } //this is needed for mog and probably all other projects
                return contentField(label, value)
            }
        })
    }

    info() {
        let interviewee = getInterviewee(this.props);
        if (interviewee) {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {contentField(t(this.props, 'interviewee_name'), fullname(this.props, interviewee, true), "")}
                        {/* {this.typologies()} */}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {contentField(t(this.props, 'interviewee_name'), this.props.interview.anonymous_title[this.props.locale], "")}
                    </AuthShowContainer>
                    {contentField(t(this.props, 'activerecord.attributes.person.alias_names'), interviewee.names[this.props.locale] && interviewee.names[this.props.locale].aliasname, '', this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'activerecord.attributes.person.pseudonym'), interviewee.names[this.props.locale] && interviewee.names[this.props.locale].aliasname, '', this.props.projectId === 'dg')}
                    {this.detailViewFields()}
                    {/* {contentField(t(this.props, 'search_facets.camps'), this.props.interview.camps && this.props.interview.camps[this.props.locale], "", this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'search_facets.groups'), this.props.interview.groups && this.props.interview.groups[this.props.locale], "", this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'search_facets.group_details'), this.props.interview.group_details && this.props.interview.group_details[this.props.locale], "", this.props.projectId === 'campscapes')} */}
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
