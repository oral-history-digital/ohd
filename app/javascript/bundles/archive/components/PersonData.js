import React from 'react';
import { t, fullname, admin, getInterviewee, contentField, pathBase } from '../../../lib/utils';
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

    existsPublicBiography(lang) {
        let firstKey = Object.keys(getInterviewee(this.props).biographical_entries)[0];
        let firstEntry = getInterviewee(this.props).biographical_entries[firstKey];
        return !!firstKey && !!firstEntry.text[lang] && firstEntry.workflow_state === 'public';
    }

    download(lang, condition) {
        if (!condition && this.existsPublicBiography(lang)) {
            return (
                <a className='flyout-download-link-lang'
                    href={pathBase(this.props) + '/biographical_entries/' + this.props.archiveId + '.pdf?lang=' + lang}>
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

    detailViewFields(){
        let _this = this;
        let interviewee = getInterviewee(_this.props);
        return this.props.detailViewFields.map(function(datum, i){
            let label = datum.label && datum.label[_this.props.locale] || t(_this.props, datum.name);
            let value = ''
            if (datum.source === 'person' || datum.ref_object_type === 'Person') {
                //
                // Pardon Rico mit dieser Version gibt es immer den Fehler:
                //
                // Uncaught Invariant Violation: Objects are not valid as a React child (found: object with keys {}). If you meant to render a collection of children, use an array instead.
                //
                // vielleicht sollten wir nochmal klären bei  welchen Daten die eine Version bei dir nicht und die andere bei mir nicht läuft und dann eine gemeinsame Lösing finden :).
                //
                //value = interviewee[datum.name][_this.props.locale] || interviewee[datum.name]
                //
                value = datum.ref_object_type === 'Person' ? interviewee[datum.name][_this.props.locale] :
                    interviewee[datum.name]
            } else {
                value = _this.props.interview[datum.name] && _this.props.interview[datum.name][_this.props.locale] || _this.props.interview[datum.name]
            }
            if (Array.isArray(value)){ value = value.join(", ") } //this is needed for mog and probably all other projects
            return contentField(label, value)
        })
    }

    info() {
        let interviewee = getInterviewee(this.props);
        if (interviewee) {
            let biographicalEntry = interviewee.biographical_entries[Object.keys(interviewee.biographical_entries)[0]];
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {contentField(t(this.props, 'interviewee_name'), fullname(this.props, interviewee, true), "")}
                        {/* {this.typologies()} */}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {contentField(t(this.props, 'interviewee_name'), this.props.interview.anonymous_title[this.props.locale], "")}
                    </AuthShowContainer>
                    {contentField(t(this.props, 'activerecord.attributes.person.alias_names'), interviewee.names[this.props.locale].aliasname, '', this.props.projectId === 'campscapes')}
                    {/* {this.history()} */}
                    {this.detailViewFields()}
                    {contentField(t(this.props, 'search_facets.camps'), this.props.interview.camps && this.props.interview.camps[this.props.locale], "", this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'search_facets.groups'), this.props.interview.groups && this.props.interview.groups[this.props.locale], "", this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'search_facets.group_details'), this.props.interview.group_details && this.props.interview.group_details[this.props.locale], "", this.props.projectId === 'campscapes')}
                    {contentField(t(this.props, 'activerecord.models.biographical_entry.one'), biographicalEntry && biographicalEntry.text[this.props.locale], '', this.props.projectId === 'campscapes')}
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
                    {contentField(t(this.props, 'biographical_entries_from'), fullname(this.props, interviewee, true), "")}
                    <BiographicalEntriesContainer person={interviewee} />
                </div>
            );
        } else {
            return this.info();
        }

    }
}

