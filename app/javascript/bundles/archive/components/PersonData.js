import React from 'react';
import ArchiveUtils from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';

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
                <p><span className="flyout-content-label">{typology}:</span><span className="flyout-content-data">{this.props.interviewee.typology[this.props.locale].join(', ')}</span>
                </p>
                <AuthShowContainer ifLoggedIn={true}>
                    <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'history')}:</span>
                        <a
                            href={"/" + this.props.locale + '/interviews/' + this.props.archiveId + '.pdf?lang=de&kind=history'}>
                            <i className="fa fa-download flyout-content-ico" title={ArchiveUtils.translate(this.props, 'download')}></i>
                            <span>de</span>
                        </a>&nbsp;
                        <a
                            href={"/" + this.props.locale + '/interviews/' + this.props.archiveId + '.pdf?lang=el&kind=history'}>
                            <i className="fa fa-download flyout-content-ico" title={ArchiveUtils.translate(this.props, 'download')}></i>
                            <span>el</span>
                        </a>
                    </p>
                </AuthShowContainer>
            </div>
        );
    }
}

