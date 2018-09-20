import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';
import PersonFormContainer from '../containers/PersonFormContainer';
import BiographicalEntriesContainer from '../containers/BiographicalEntriesContainer';

export default class PersonData extends React.Component {


    content(label, value, className) {
        return (
            <p>
                <span className="flyout-content-label">{label}:</span>
                <span className={"flyout-content-data " + className}>{value}</span>
            </p>
        )
    }

    placeOfBirth(){
        if (
            this.props.interviewee.place_of_birth &&
            this.props.interviewee.place_of_birth.name[this.props.locale] && 
            this.props.interviewee.place_of_birth.name[this.props.locale] !== ""
        ){
            return this.content(t(this.props, 'place_of_birth'), this.props.interviewee.place_of_birth.name[this.props.locale], "" );
        }
    }


    typologies(){
        if (this.props.interviewee.typology && this.props.interviewee.typology[this.props.locale]){
            return this.content(t(this.props, 'typologies'), this.props.interviewee.typology[this.props.locale].join(', '),"" );
        } else {
            return "";
        }
    }

    download(lang, condition) {
        if (!condition) {
            return (
                <a className='flyout-download-link-lang'
                    href={"/" + this.props.locale + '/biographical_entries/' + this.props.archiveId + '.pdf?lang=' + lang}>
                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                    <span>{lang}</span>
                </a>
            )
        } else {
            return null;
        }
    }

    info() {
        if (this.props.interviewee) {
            return (
                <div>
                    {this.content(t(this.props, 'interviewee_name'), fullname(this.props, this.props.interviewee, true), "")}
                    {this.content(t(this.props, 'date_of_birth'), this.props.interviewee.date_of_birth, "figure-letter-spacing")}
                    {this.placeOfBirth()}
                    {this.typologies()}
                    <AuthShowContainer ifLoggedIn={true}>
                        <p>
                            <span className="flyout-content-label">{t(this.props, 'history')}:</span>
                            {this.download(this.props.interview.lang)}
                            {this.download(this.props.locale, (this.props.interview.lang === this.props.locale))}
                        </p>
                    </AuthShowContainer>
                </div>
            );
        } else {
            return t(this.props, 'no_interviewee');
        }
    }

    render() {
        if (admin(this.props)) {
            return (
                <div>
                    {this.content(t(this.props, 'biographical_entries_from'), fullname(this.props, this.props.interviewee, true), "")}
                    <BiographicalEntriesContainer person={this.props.interviewee} />
                </div>
            );
        } else {
            return this.info();
        }

    }
}

