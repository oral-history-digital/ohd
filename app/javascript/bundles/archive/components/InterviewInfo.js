import React from 'react';
import ArchiveUtils from '../../../lib/utils';

import {
    INTERVIEW_URL
} from '../constants/archiveConstants';


export default class InterviewInfo extends React.Component {

    render() {
        return(
            <div>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'date')}:</span><span className="flyout-content-data">{this.props.interview.created}</span></p>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'duration')}:</span><span className="flyout-content-data">{this.props.interview.formatted_duration}</span></p>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'language')}:</span><span className="flyout-content-data">{ArchiveUtils.translate(this.props, this.props.interview.languages.join(''))}</span></p>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'id')}:</span><span className="flyout-content-data">{this.props.archiveId}</span></p>
                <p><a href={INTERVIEW_URL +'/' + this.props.archiveId + '.pdf?locale=' + this.props.locale + '&kind=interview'}> <i className="fa fa-download flyout-content-ico"></i><span>{ArchiveUtils.translate(this.props,'transcript')}</span> </a></p>
            </div>
        );
    }
}

