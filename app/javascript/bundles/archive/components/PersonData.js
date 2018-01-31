import React from 'react';
import ArchiveUtils from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';

export default class PersonData extends React.Component {


    content(label, value) {
        return (
            <p>
                <span className="flyout-content-label">{label}:</span>
                <span className="flyout-content-data">{value}</span>
            </p>
        )
    }


    placeOfBirth(){
        if (this.props.interviewee.place_of_birth){
            return this.content(ArchiveUtils.translate(this.props, 'place_of_birth'), this.props.interviewee.place_of_birth.descriptor[this.props.locale] );
        }
    }


    render() {
        let typology = ArchiveUtils.translate(this.props, 'search_facets') ? ArchiveUtils.translate(this.props, 'search_facets')['typology'] : "";
        let fullName = `${this.props.interviewee.names[this.props.locale].firstname} ${this.props.interviewee.names[this.props.locale].lastname} ${this.props.interviewee.names[this.props.locale].birthname}`
        return (
            <div>

                {this.content(ArchiveUtils.translate(this.props, 'interviewee_name'), fullName)}
                {this.content(ArchiveUtils.translate(this.props, 'date_of_birth'), this.props.interviewee.date_of_birth)}
                {this.placeOfBirth()}
                {this.content(typology, this.props.interviewee.typology[this.props.locale].join(', ') )}

                <AuthShowContainer ifLoggedIn={true}>
                    <p><span className="flyout-content-label">{ArchiveUtils.translate(this.props, 'history')}:</span>
                        <a className='flyout-download-link-lang'
                            href={"/" + this.props.locale + '/interviews/' + this.props.archiveId + '.pdf?lang=de&kind=history'}>
                            <i className="fa fa-download flyout-content-ico" title={ArchiveUtils.translate(this.props, 'download')}></i>
                            <span>de</span>
                        </a>
                        <a className='flyout-download-link-lang'
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

