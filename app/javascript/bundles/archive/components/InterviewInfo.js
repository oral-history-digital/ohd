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
        if (this.props.interview && this.props.interview.language) {
            return (
                <div>
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        validate={function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)}}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'archive_id')}
                    />
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'interview_date')}
                    />
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        optionsScope={'search_facets'}
                        elementType={'select'}
                        values={['video', 'audio']}
                        value={t(this.props, `search_facets.${this.props.interview.media_type}`)}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'media_type')}
                    />
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        value={this.props.interview.duration_human}
                        validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'duration')}
                    />
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        validate={function(v){return /^\d+$/.test(v)}}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'tape_count')}
                    />
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        obj={this.props.interview}
                        values={this.props.languages}
                        withEmpty={true}
                        validate={function(v){return /^\d+$/.test(v)}}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'language_id')}
                    />
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        obj={this.props.interview}
                        values={this.props.collections}
                        withEmpty={true}
                        validate={function(v){return /^\d+$/.test(v)}}
                        individualErrorMsg={'empty'}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'collection_id')}
                    >
                        {this.collection()}
                    </SingleValueWithFormContainer>
                    <SingleValueWithFormContainer
                        obj={this.props.interview}
                        collapse={true}
                        elementType={'textarea'}
                        metadataField={Object.values(this.props.project.metadata_fields).find(m => m.name === 'observations')}
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

