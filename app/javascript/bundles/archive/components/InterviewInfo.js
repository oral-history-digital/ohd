import React from 'react';
import { t } from '../../../lib/utils';
import SingleValueWithFormContainer from '../containers/SingleValueWithFormContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import SelectedRegistryReferencesContainer from '../containers/SelectedRegistryReferencesContainer';

export default class InterviewInfo extends React.Component {

    collection() {
        let c = this.props.collections[this.props.interview.collection_id];
        if (c) {
            return (
                <span>
                    <i className="fa fa-info-circle" aria-hidden="true" title={c.notes}  style={{'color': 'grey'}} />
                    <a href={c.homepage[this.props.locale]} title={c.homepage[this.props.locale]} target='_blank'>
                        <i className="fa fa-external-link" aria-hidden="true" style={{'color': 'grey'}} />
                    </a>
                </span>
            )
        }
    }

    render() {
        // It could be good to replace all the <SingleValueWithFormContainer ... /> stuff with sth like the following
        //
        //return this.props.detailViewFields.map(function(metadataField, i){
            //if (metadataField.source === 'Interview'){
                //return (
                    //<SingleValueWithFormContainer
                        //metadataField={metadataField}
                        //obj={interviewee}
                    ///>
                //)
             //}
        //})

        let _this = this;
        let interviewMetadataFieldNames = Object.values(this.props.project.metadata_fields).filter(m => {
            return (m.source === 'Interview' &&
                (
                    (_this.props.isLoggedIn && m.use_in_details_view) ||
                    (!_this.props.isLoggedIn && m.display_on_landing_page) 
                )
            )
        }).map(m => m.name);

        if (this.props.interview && this.props.interview.language) {
            return (
                <div>
                    <SingleValueWithFormContainer
                        attribute={'archive_id'}
                        obj={this.props.interview}
                        validate={function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)}}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('archive_id') === -1}
                    />
                    <SingleValueWithFormContainer
                        attribute={'interview_date'}
                        obj={this.props.interview}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('interview_date') === -1}
                    />
                    <SingleValueWithFormContainer
                        attribute={'media_type'}
                        obj={this.props.interview}
                        optionsScope={'search_facets'}
                        elementType={'select'}
                        values={['video', 'audio']}
                        value={t(this.props, `search_facets.${this.props.interview.media_type}`)}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('media_type') === -1}
                    />
                    <SingleValueWithFormContainer
                        attribute='duration'
                        obj={this.props.interview}
                        value={this.props.interview.duration_human}
                        validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('duration') === -1}
                    />
                    <SingleValueWithFormContainer
                        attribute={'tape_count'}
                        obj={this.props.interview}
                        validate={function(v){return /^\d+$/.test(v)}}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('tape_count') === -1}
                    />
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        attribute={'language_id'}
                        obj={this.props.interview}
                        values={this.props.languages}
                        withEmpty={true}
                        validate={function(v){return /^\d+$/.test(v)}}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('language_id') === -1}
                    />
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        attribute={'collection_id'}
                        obj={this.props.interview}
                        values={this.props.collections}
                        withEmpty={true}
                        validate={function(v){return /^\d+$/.test(v)}}
                        individualErrorMsg={'empty'}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('collection_id') === -1}
                        //criterionForExclusion={this.props.projectId === 'mog'}
                    >
                        {this.collection()}
                    </SingleValueWithFormContainer>
                    <SingleValueWithFormContainer
                        attribute={'observations'}
                        obj={this.props.interview}
                        collapse={true}
                        elementType={'textarea'}
                        criterionForExclusion={interviewMetadataFieldNames.indexOf('observations') === -1}
                    />
                    <AuthShowContainer ifAdmin={true} obj={this.props.interview}>
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={this.props.interview}
                            attribute={'workflow_state'}
                            values={['public', 'unshared']}
                            value={t(this.props, `workflow_states.${this.props.interview.workflow_state}`)}
                            optionsScope={'workflow_states'}
                        /> 
                    </AuthShowContainer>
                    <SelectedRegistryReferencesContainer refObject={this.props.interview} />
                </div>
            );
        } else {
            return null;
        }
    }
}

