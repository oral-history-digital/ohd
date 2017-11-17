import React from 'react';
import PersonDataContainer from '../containers/PersonDataContainer';

export default class PersonData extends React.Component {

    render() {
        return(
            <div>
                <p><span className="flyout-content-label">Name:</span><span className="flyout-content-data">{this.props.name}</span></p>
                <p><span className="flyout-content-label">Geboren am:</span><span className="flyout-content-data">{this.props.interviewee.date_of_birth}</span></p>
                <p><span className="flyout-content-label">Erfahrungshintergrund:</span><span className="flyout-content-data">"Noch nicht in DB"</span></p>
                <p><a href={this.props.archiveId + '.pdf?type=translation'}> <i className="fa fa-download flyout-content-ico"></i><span>Kurzbiografie (pdf)</span> </a></p>


            </div>
        );
    }
}

