import PropTypes from 'prop-types';
import { FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';

import { SingleValueWithFormContainer } from 'modules/forms';
import { Fetch, getCollectionsForCurrentProjectFetched } from 'modules/data';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProjectAccessStatus } from 'modules/auth';

export default function InterviewInfo({
    interview,
    project,
    collections,
    languages,
    locale,
}) {
    const { t } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus();
    const collection = collections[interview.collection_id];

    if (interview?.language_id) {
        return (
            <div>
                <SingleValueWithFormContainer
                    obj={interview}
                    validate={function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)}}
                    attribute={'archive_id'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    attribute={'signature_original'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    attribute={'interview_date'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    attribute={'description'}
                    projectAccessGranted={projectAccessGranted}
                    elementType="textarea"
                    multiLocale
                    validate={v => v?.length > 3}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    optionsScope={'search_facets'}
                    elementType={'select'}
                    values={['video', 'audio']}
                    value={t(`search_facets.${interview.media_type}`)}
                    attribute={'media_type'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                    attribute={'duration'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    obj={interview}
                    validate={function(v){return /^\d+$/.test(v)}}
                    attribute={'tape_count'}
                    projectAccessGranted={projectAccessGranted}
                />
                <SingleValueWithFormContainer
                    elementType={'select'}
                    obj={interview}
                    values={languages}
                    withEmpty={true}
                    validate={function(v){return /^\d+$/.test(v)}}
                    attribute={'language_id'}
                    projectAccessGranted={projectAccessGranted}
                />
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
                        attribute={'collection_id'}
                        projectAccessGranted={projectAccessGranted}
                    >
                        {collection && collectionLink(collection, locale)}
                    </SingleValueWithFormContainer>
                </Fetch>

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
                <FaInfoCircle
                    className="Icon Icon--unobtrusive u-mr-tiny"
                    title={title}
                />
                <a
                    href={collection.homepage[locale]}
                    title={collection.homepage[locale]}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaExternalLinkAlt className="Icon Icon--unobtrusive u-mr-tiny" />
                </a>
            </span>
        )
    }
