import React from 'react';
import PropTypes from 'prop-types';

import { SingleValueWithFormContainer } from 'modules/forms';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';

export default class InterviewInfo extends React.Component {
    collection() {
        let c = this.props.collections[this.props.interview.collection_id];
        let title = c && c.notes && c.notes[this.props.locale] || ''
        if (c) {
            return (
                <span>
                    <i
                        className="fa fa-info-circle"
                        aria-hidden="true"
                        title={title}
                        style={{'color': 'grey'}}
                    />
                    <a
                        href={c.homepage[this.props.locale]}
                        title={c.homepage[this.props.locale]}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <i
                            className="fa fa-external-link"
                            aria-hidden="true"
                            style={{'color': 'grey'}}
                        />
                    </a>
                </span>
            )
        }
    }

    render() {
        const archiveIdMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'archive_id');
        const signatureOriginalMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'signature_original');
        const interviewDateMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'interview_date');
        const descriptionMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'description');
        const mediaTypeMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'media_type');
        const durationMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'duration');
        const tapeCountMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'tape_count');
        const languageIdMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'language_id');
        const collectionIdMetadataField = Object.values(this.props.project.metadata_fields).find(m => m.name === 'collection_id');

        if (this.props.interview && this.props.interview.language_id) {
            return (
                <div>
                    {
                        archiveIdMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            validate={function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)}}
                            metadataField={archiveIdMetadataField}
                        />
                    }
                    {
                        signatureOriginalMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            metadataField={signatureOriginalMetadataField}
                        />
                    }
                    {
                        interviewDateMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            metadataField={interviewDateMetadataField}
                        />
                    }
                    {
                        descriptionMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            metadataField={descriptionMetadataField}
                            elementType="textarea"
                            multiLocale
                            validate={v => v.length <= 300}
                        />
                    }
                    {
                        mediaTypeMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            optionsScope={'search_facets'}
                            elementType={'select'}
                            values={['video', 'audio']}
                            value={t(this.props, `search_facets.${this.props.interview.media_type}`)}
                            metadataField={mediaTypeMetadataField}
                        />
                    }
                    {
                        durationMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                            metadataField={durationMetadataField}
                        />
                    }
                    {
                        tapeCountMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={this.props.interview}
                            validate={function(v){return /^\d+$/.test(v)}}
                            metadataField={tapeCountMetadataField}
                        />
                    }
                    {
                        languageIdMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={this.props.interview}
                            values={this.props.languages}
                            withEmpty={true}
                            validate={function(v){return /^\d+$/.test(v)}}
                            metadataField={languageIdMetadataField}
                        />
                    }
                    {
                        collectionIdMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={this.props.interview}
                            values={this.props.collections}
                            withEmpty={true}
                            validate={function(v){return /^\d+$/.test(v)}}
                            individualErrorMsg={'empty'}
                            metadataField={collectionIdMetadataField}
                        >
                            {this.collection()}
                        </SingleValueWithFormContainer>
                    }

                    <AuthorizedContent object={this.props.interview}>
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={this.props.interview}
                            attribute={'workflow_state'}
                            values={['public', 'unshared']}
                            value={t(this.props, `workflow_states.${this.props.interview.workflow_state}`)}
                            optionsScope={'workflow_states'}
                            noStatusCheckbox={true}
                        />
                    </AuthorizedContent>

                    <SelectedRegistryReferencesContainer refObject={this.props.interview} />
                </div>
            );
        } else {
            return null;
        }
    }
}

InterviewInfo.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
