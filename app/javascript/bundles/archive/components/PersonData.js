import React from 'react';
import ArchiveUtils from '../../../lib/utils';

export default class PersonData extends React.Component {

    render() {
        let typology = ArchiveUtils.translate(this.props, 'personal_data') ? ArchiveUtils.translate(this.props, 'personal_data')['translated_typology'] : "";
        return(
            <div>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'interviewee_name')}:</span><span className="flyout-content-data">{this.props.interviewee.names[this.props.locale].firstname} {this.props.interviewee.names[this.props.locale].lastname} {this.props.interviewee.names[this.props.locale].birthname}</span></p>
                <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'date_of_birth')}:</span><span className="flyout-content-data">{this.props.interviewee.date_of_birth}</span></p>
                <p><span className="flyout-content-label">{typology}:</span><span className="flyout-content-data">"Noch nicht in DB"</span></p>
                <p><a href={this.props.archiveId + '.pdf?locale=' + this.props.locale + '&kind=history'}> <i className="fa fa-download flyout-content-ico"></i><span>Kurzbiografie (pdf)</span> </a></p>
            </div>
        );
    }
}

