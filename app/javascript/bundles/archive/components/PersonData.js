import React from 'react';
import { t } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';

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
        if (this.props.interviewee.place_of_birth){
            return this.content(t(this.props, 'place_of_birth'), this.props.interviewee.place_of_birth.descriptor[this.props.locale], "" );
        }
    }


    typologies(){
        if (this.props.interviewee.typology && this.props.interviewee.typology[this.props.locale].length > 1){
            return this.content(t(this.props, 'typologies'), this.props.interviewee.typology[this.props.locale].join(', '),"" );
        } else if (this.props.interviewee.typology && this.props.interviewee.typology[this.props.locale].length == 1){
            return this.content(t(this.props, 'typology'), this.props.interviewee.typology[this.props.locale][0], "");
        }
    }

    download(lang, condition) {
        if (!condition) {
            return (
                <a className='flyout-download-link-lang'
                    href={"/" + this.props.locale + '/interviews/' + this.props.archiveId + '.pdf?lang=' + lang + '&kind=history'}>
                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                    <span>{lang}</span>
                </a>
            )
        } else {
            return null;
        }
    }

    render() {
        if (this.props.interviewee) {
            let fullName = `${this.props.interviewee.names[this.props.locale].firstname} ${this.props.interviewee.names[this.props.locale].lastname} ${this.props.interviewee.names[this.props.locale].birthname}`
            return (
                <div>

                    {this.content(t(this.props, 'interviewee_name'), fullName, "")}
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
}

