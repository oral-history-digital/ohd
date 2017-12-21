import React from 'react';
import ArchiveUtils from '../../../lib/utils';

export default class PersonData extends React.Component {

    render() {
        let typology = ArchiveUtils.translate(this.props, 'search_facets') ? ArchiveUtils.translate(this.props, 'search_facets')['typology'] : "";
        let fullName = `${this.props.interviewee.names[this.props.locale].firstname} ${this.props.interviewee.names[this.props.locale].lastname} ${this.props.interviewee.names[this.props.locale].birthname}`
        return (
            <div>
                <p><span
                    className="flyout-content-label">{ArchiveUtils.translate(this.props, 'interviewee_name')}:</span><span
                    className="flyout-content-data">{fullName}</span></p>
                <p><span
                    className="flyout-content-label">{ArchiveUtils.translate(this.props, 'date_of_birth')}:</span><span
                    className="flyout-content-data">{this.props.interviewee.date_of_birth}</span></p>
                <p><span className="flyout-content-label">{typology}:</span><span className="flyout-content-data">"Noch nicht in DB"</span>
                </p>
                <p>
                    <a
                        href={"/" + this.props.locale + '/interviews/' + this.props.archiveId + '.pdf?locale=' + this.props.locale + '&kind=history'}>
                        <i className="fa fa-download flyout-content-ico"></i>
                        <span>{ArchiveUtils.translate(this.props, 'history')}</span>
                    </a>
                </p>
            </div>
        );
    }
}

