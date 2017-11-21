import React from 'react';
import PersonDataContainer from '../containers/PersonDataContainer';

export default class InterviewInfo extends React.Component {

    render() {
        return(
            <div>
                <p><span className="flyout-content-label">Id:</span><span className="flyout-content-data">{this.props.archiveId}</span></p>
                <p><span className="flyout-content-label">Dauer:</span><span className="flyout-content-data">{this.props.interview.formatted_duration}</span></p>



            </div>
        );
    }
}

