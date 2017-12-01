import React from 'react';
import ArchiveUtils from '../../../lib/utils';

import {
    INTERVIEW_URL
} from '../constants/archiveConstants';


export default class InterviewInfo extends React.Component {

    fullName(person) {
        if(person) {
          return `${person.names[this.props.locale].firstname} ${person.names[this.props.locale].lastname}`;
        }
    }

    content(label, value) {
        return <p>
                   <span className="flyout-content-label">{label}:</span>
                   <span className="flyout-content-data">{value}</span>
               </p>
    }

    render() {
        return(
            <div>
                {this.content(ArchiveUtils.translate(this.props, 'date'), this.props.interview.created)}
                {this.content(ArchiveUtils.translate(this.props, 'duration'), this.props.interview.formatted_duration)}
                {this.content(ArchiveUtils.translate(this.props, 'language'), ArchiveUtils.translate(this.props, this.props.interview.languages.join('')))}
                {this.content(ArchiveUtils.translate(this.props, 'interview'), this.fullName(this.props.interviewer))}
                {this.content(ArchiveUtils.translate(this.props, 'camera'), this.fullName(this.props.cinematographer))}
                {this.content(ArchiveUtils.translate(this.props, 'id'), this.props.archiveId)}
                <p><a href={INTERVIEW_URL +'/' + this.props.archiveId + '.pdf?locale=' + this.props.locale + '&kind=interview'}> <i className="fa fa-download flyout-content-ico"></i><span>{ArchiveUtils.translate(this.props,'transcript')}</span> </a></p>
            </div>
        );
    }
}

