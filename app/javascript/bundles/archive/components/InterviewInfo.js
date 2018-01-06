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
            return `${person.names[this.props.locale].firstname} ${person.names[this.props.locale].lastname}`;
        }
    }

    content(label, value) {
        return (
            <p>
                <span className="flyout-content-label">{label}:</span>
                <span className="flyout-content-data">{value}</span>
            </p>
        )
    }

    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    download(transcript=true) {
        let lang = transcript ? this.props.interview.lang : this.props.locale;
        let textKey = transcript ? 'transcript' : 'translation';
        return (
                    <p>
                        <Link to={`${this.to()}.pdf?lang=${lang}&kind=interview`}>
                            <i className="fa fa-download flyout-content-ico"></i>
                            <span>{ArchiveUtils.translate(this.props, textKey)}</span>
                        </Link>
                    </p>
        )
    }

    interviewLink() {
        return <Link to={this.to()}>{this.to()}</Link>
    }

    render() {
        return (
            <div>
                {this.content(ArchiveUtils.translate(this.props, 'date'), this.props.interview.created)}
                {this.content(ArchiveUtils.translate(this.props, 'duration'), this.props.interview.formatted_duration)}
                {this.content(ArchiveUtils.translate(this.props, 'language'), ArchiveUtils.translate(this.props, this.props.interview.languages.join('')))}
                {this.content(ArchiveUtils.translate(this.props, 'interview'), this.fullName(this.props.interviewer))}
                {this.content(ArchiveUtils.translate(this.props, 'camera'), this.fullName(this.props.cinematographer))}
                {this.content(ArchiveUtils.translate(this.props, 'id'), this.props.archiveId)}
                {this.content(ArchiveUtils.translate(this.props, 'doi'), this.interviewLink())}
                <AuthShowContainer ifLoggedIn={true}>
                    {this.download()}
                    {this.download(false)}
                </AuthShowContainer>
            </div>
        );
    }
}

