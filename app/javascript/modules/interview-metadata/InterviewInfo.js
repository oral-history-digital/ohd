import { Component } from 'react';
import PropTypes from 'prop-types';

import { SingleValueWithFormContainer } from 'modules/forms';
import { Fetch, getCollectionsForCurrentProjectFetched } from 'modules/data';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';

export default function InterviewInfo({
    interview,
    project,
    collections,
    languages,
    locale,
}) {
    const { t } = useI18n();
    const collection = collections[interview.collection_id];

    const archiveIdMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'archive_id');
    const signatureOriginalMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'signature_original');
    const interviewDateMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'interview_date');
    const descriptionMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'description');
    const mediaTypeMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'media_type');
    const durationMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'duration');
    const tapeCountMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'tape_count');
    const languageIdMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'language_id');
    const collectionIdMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'collection_id');

    if (interview?.language_id) {
        return (
            <div>
                {
                    archiveIdMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        validate={function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)}}
                        metadataField={archiveIdMetadataField}
                    />
                }
                {
                    signatureOriginalMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        metadataField={signatureOriginalMetadataField}
                    />
                }
                {
                    interviewDateMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        metadataField={interviewDateMetadataField}
                    />
                }
                {
                    descriptionMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        metadataField={descriptionMetadataField}
                        elementType="textarea"
                        multiLocale
                        validate={v => v?.length > 3}
                    />
                }
                {
                    mediaTypeMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        optionsScope={'search_facets'}
                        elementType={'select'}
                        values={['video', 'audio']}
                        value={t(`search_facets.${interview.media_type}`)}
                        metadataField={mediaTypeMetadataField}
                    />
                }
                {
                    durationMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                        metadataField={durationMetadataField}
                    />
                }
                {
                    tapeCountMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        obj={interview}
                        validate={function(v){return /^\d+$/.test(v)}}
                        metadataField={tapeCountMetadataField}
                    />
                }
                {
                    languageIdMetadataField?.use_in_details_view &&
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        obj={interview}
                        values={languages}
                        withEmpty={true}
                        validate={function(v){return /^\d+$/.test(v)}}
                        metadataField={languageIdMetadataField}
                    />
                }
                {
                    collectionIdMetadataField?.use_in_details_view &&
                    <Fetch
                        fetchParams={['collections', null, null, `for_projects=${project?.id}`]}
                        testSelector={getCollectionsForCurrentProjectFetched}
                    >
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={interview}
                            values={collections}
                            withEmpty={true}
                            validate={function(v){return /^\d+$/.test(v)}}
                            individualErrorMsg={'empty'}
                            metadataField={collectionIdMetadataField}
                        >
                            {collection && collectionLink(collection, locale)}
                        </SingleValueWithFormContainer>
                    </Fetch>
                }

                <AuthorizedContent object={interview} action='update'>
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        obj={interview}
                        attribute={'workflow_state'}
                        values={['public', 'unshared']}
                        value={t(`workflow_states.${interview.workflow_state}`)}
                        optionsScope={'workflow_states'}
                        noStatusCheckbox={true}
                    />
                </AuthorizedContent>

                <SelectedRegistryReferencesContainer refObject={interview} />
            </div>
        );
    } else {
        return null;
    }
}

InterviewInfo.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};

function collectionLink(collection, locale) {
        const title = collection.notes && collection.notes[locale] || ''
        return (
            <span>
                <i
                    className="fa fa-info-circle"
                    aria-hidden="true"
                    title={title}
                    style={{'color': 'grey'}}
                />
                <a
                    href={collection.homepage[locale]}
                    title={collection.homepage[locale]}
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

