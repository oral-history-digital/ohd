import React from 'react';
import { t, fullname } from '../../../lib/utils';
import {Link, hashHistory} from 'react-router-dom';
import AuthShowContainer from '../containers/AuthShowContainer';

import {
    INTERVIEW_URL
} from '../constants/archiveConstants';


export default class InterviewInfo extends React.Component {

    content(label, value, className) {
        if (value) {
            return (
                <p>
                    <span className="flyout-content-label">{label}:</span>
                    <span className={"flyout-content-data " + className}>{value}</span>
                </p>
            )
        }
    }

    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    download(lang) {
        let textKey = this.props.interview.lang === lang ? 'transcript' : 'translation';
        return (
            <p>
                <a href={`${this.to()}.pdf?lang=${lang}&kind=interview`}>
                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                    <span>{t(this.props, textKey)}</span>
                </a>
            </p>
        )
    }


    placeOfInterview(){
        if (this.props.interview.place_of_interview){
            return this.content(t(this.props, 'place_of_interview'), this.props.interview.place_of_interview.descriptor[this.props.locale], "" );
        }
    }

    language(){
        if (this.props.interview.translated){
            return this.content(t(this.props, 'language'), t(this.props, 'language_' + this.props.interview.languages.join('')), "");
        } else {
            return this.content(t(this.props, 'language'), t(this.props, 'language_' + this.props.interview.lang ), "");
        }
    }

    segmentators(){
        let names = [];
        if (this.props.segmentators.length > 0){
            names = this.props.segmentators.map(s => fullname(s));
        }
        return names.join(', ')
    }

    tapes(){
        if (this.props.interview.tape_count > 1){
            return this.content(t(this.props, 'tapes'), this.props.interview.tape_count, "")
        }
    }


    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.content(t(this.props, 'date'), this.props.interview.created, "figure-letter-spacing")}
                    {this.placeOfInterview()}
                    {this.content(t(this.props, 'duration'), this.props.interview.formatted_duration, "figure-letter-spacing")}
                    {this.tapes()}
                    {this.language()}
                    {this.content(t(this.props, 'interview'), fullname(this.props.interviewer), "")}
                    {this.content(t(this.props, 'camera'), fullname(this.props.cinematographer), "")}
                    {this.content(t(this.props, 'transcript'), fullname(this.props.transcriptor), "")}
                    {this.content(t(this.props, 'translation'), fullname(this.props.translator), "")}
                    {this.content(t(this.props, 'segmentation'), this.segmentators(), "")}
                    {this.content(t(this.props, 'id'), this.props.archiveId, "")}
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.download(this.props.interview.lang)}
                        {this.download(this.props.locale)}
                    </AuthShowContainer>
                </div>
            );
        } else {
            return null;
        }
    }
}

