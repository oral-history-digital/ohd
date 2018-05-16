import React from 'react';
import ArchiveUtils from '../../../lib/utils';
import {Link, hashHistory} from 'react-router-dom';
import AuthShowContainer from '../containers/AuthShowContainer';

import {
    INTERVIEW_URL
} from '../constants/archiveConstants';


export default class InterviewInfo extends React.Component {

    fullName(person) {
        if (person) {
            try {
                return `${person.names[this.props.locale].firstname} ${person.names[this.props.locale].lastname}`;
            } catch (e) {
                debugger;
                return `person ${person.id} has no name(s) in ${this.props.locale}`;
            }
        }
    }

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
                    <i className="fa fa-download flyout-content-ico" title={ArchiveUtils.translate(this.props, 'download')}></i>
                    <span>{ArchiveUtils.translate(this.props, textKey)}</span>
                </a>
            </p>
        )
    }


    placeOfInterview(){
        if (this.props.interview.place_of_interview){
            return this.content(ArchiveUtils.translate(this.props, 'place_of_interview'), this.props.interview.place_of_interview.descriptor[this.props.locale], "" );
        }
    }

    language(){
        if (this.props.interview.translated){
            return this.content(ArchiveUtils.translate(this.props, 'language'), ArchiveUtils.translate(this.props, 'language_' + this.props.interview.languages.join('')), "");
        } else {
            return this.content(ArchiveUtils.translate(this.props, 'language'), ArchiveUtils.translate(this.props, 'language_' + this.props.interview.lang ), "");
        }
    }

    segmentators(){
        let names = [];
        if (this.props.segmentators.length > 0){
            names = this.props.segmentators.map(s => this.fullName(s));
        }
        return names.join(', ')
    }

    tapes(){
        if (this.props.interview.tape_count > 1){
            return this.content(ArchiveUtils.translate(this.props, 'tapes'), this.props.interview.tape_count, "")
        }
    }


    render() {
        return (
            <div>
                {this.content(ArchiveUtils.translate(this.props, 'date'), this.props.interview.created, "figure-letter-spacing")}
                {this.placeOfInterview()}
                {this.content(ArchiveUtils.translate(this.props, 'duration'), this.props.interview.formatted_duration, "figure-letter-spacing")}
                {this.tapes()}
                {this.language()}
                {this.content(ArchiveUtils.translate(this.props, 'interview'), this.fullName(this.props.interviewer), "")}
                {this.content(ArchiveUtils.translate(this.props, 'camera'), this.fullName(this.props.cinematographer), "")}
                {this.content(ArchiveUtils.translate(this.props, 'transcript'), this.fullName(this.props.transcriptor), "")}
                {this.content(ArchiveUtils.translate(this.props, 'translation'), this.fullName(this.props.translator), "")}
                {this.content(ArchiveUtils.translate(this.props, 'segmentation'), this.segmentators(), "")}
                {this.content(ArchiveUtils.translate(this.props, 'id'), this.props.archiveId, "")}
                <AuthShowContainer ifLoggedIn={true}>
                    {this.download(this.props.interview.lang)}
                    {this.download(this.props.locale)}
                </AuthShowContainer>
            </div>
        );
    }
}

