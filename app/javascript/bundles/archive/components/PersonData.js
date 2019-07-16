import React from 'react';
import { t, fullname, admin, getInterviewee } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';
import PersonFormContainer from '../containers/PersonFormContainer';
import BiographicalEntriesContainer from '../containers/BiographicalEntriesContainer';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class PersonData extends React.Component {


    content(label, value, className, key='') {
        return (
            <p key={`persondata-content-${key}`}>
                <span className="flyout-content-label">{label}:</span>
                <span className={"flyout-content-data " + className}>{value}</span>
            </p>
        )
    }

    // dateOfBirth(){
    //     let interviewee = getInterviewee(this.props);
    //     if (interviewee.date_of_birth){
    //         return this.content(t(this.props, 'date_of_birth'), interviewee.date_of_birth, "")
    //     }
    // }

    typologies(){
        let interviewee = getInterviewee(this.props);
        if (interviewee.typology && interviewee.typology[this.props.locale]){
            return this.content(t(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '),"" );
        } else {
            return "";
        }
    }

    existsPublicBiography(lang) {
        let firstKey = Object.keys(getInterviewee(this.props).biographical_entries)[0];
        let firstEntry = getInterviewee(this.props).biographical_entries[firstKey];
        return !!firstKey && !!firstEntry.text[lang] && firstEntry.workflow_state === 'public';
    }

    download(lang, condition) {
        if (!condition && this.existsPublicBiography(lang)) {
            return (
                <a className='flyout-download-link-lang'
                    href={"/" + this.props.locale + '/biographical_entries/' + this.props.archiveId + '.pdf?lang=' + lang}>
                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                    <span>{t(this.props, lang)}</span>
                </a>
            )
        } else {
            return null;
        }
    }

    history() { 
        return (
          <AuthShowContainer ifLoggedIn={true}>
            <p>
              <span className="flyout-content-label">
                {t(this.props, "history")}:
              </span>
              {this.download(this.props.interview.lang)}
              {this.download(
                this.props.locale,
                this.props.interview.lang === this.props.locale
              )}
            </p>
          </AuthShowContainer>
        );
    }

    detailViewFields() {
        let _this = this
        return _this.props.detailViewFields.map(function(column, i){
            let interviewee = getInterviewee(_this.props);
            // first, I wrote this. Do we still need it?:
            // let field = _this.props.interview[column["name"]]
            if(column["source"] === 'person' && interviewee[column["name"]]){
                return(
                    _this.content(
                        (column["label"] && column["label"][_this.props.locale]) || t(column["name"]) || column["name"], 
                        interviewee[column["name"]] || "---",
                        // first, I wrote this. Do we still need it?:
                        // (field && field[_this.props.locale]) || (typeof (field) !== 'object' && _this.props.interview[column["name"]]) || _this.props.interview[column["name"]][0] || "---",
                        "",
                        i
                    )
                )
            } else {
                return null
            }
        });
    }

    info() {
        let interviewee = getInterviewee(this.props);
        if (interviewee) {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.content(t(this.props, 'interviewee_name'), fullname(this.props, interviewee, true), "")}
                        {this.typologies()}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {this.content(t(this.props, 'interviewee_name'), this.props.interview.anonymous_title[this.props.locale], "")}
                    </AuthShowContainer>
                    {this.history()}
                    {this.detailViewFields()}
                </div>
            );
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
    }

    render() {
        let interviewee = getInterviewee(this.props);
        if (admin(this.props, {type: 'BiographicalEntry', action: 'update'})) {
            return (
                <div>
                    {this.content(t(this.props, 'biographical_entries_from'), fullname(this.props, interviewee, true), "")}
                    <BiographicalEntriesContainer person={interviewee} />
                </div>
            );
        } else {
            return this.info();
        }

    }
}

