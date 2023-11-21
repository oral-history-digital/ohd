import PropTypes from 'prop-types';

import { SingleValueWithFormContainer } from 'modules/forms';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useProjectAccessStatus } from 'modules/auth';
import InterviewCollectionInfo from './InterviewCollectionInfo';

export default function InterviewInfo({
    interview,
    languages,
}) {
    const { t } = useI18n();
    const { project } = useProject();

    const { projectAccessGranted } = useProjectAccessStatus(project);

    if (!interview?.language_id) {
        return null;
    }

    return (
        <div>
            <SingleValueWithFormContainer
                obj={interview}
                attribute="archive_id"
                projectAccessGranted={projectAccessGranted}
                readOnly
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
                linkUrls
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
                attribute="media_missing"
                elementType="input"
                type="checkbox"
                projectAccessGranted={projectAccessGranted}
                noStatusCheckbox
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
                obj={interview}
                elementType='input'
                type='checkbox'
                attribute={'transcript_coupled'}
                projectAccessGranted={projectAccessGranted}
            />
            { ['primary_language_id', 'secondary_language_id', 'primary_translation_language_id'].map((attribute) => (
                <SingleValueWithFormContainer
                    elementType={'select'}
                    obj={interview}
                    values={languages}
                    withEmpty={true}
                    //validate={function(v){return /^\d+$/.test(v)}}
                    attribute={attribute}
                    projectAccessGranted={projectAccessGranted}
                />
            ))}

            <InterviewCollectionInfo interview={interview} />

            <AuthorizedContent object={interview} action='update'>
                <SingleValueWithFormContainer
                    elementType={'select'}
                    obj={interview}
                    attribute={'workflow_state'}
                    values={['public', 'unshared']}
                    value={t(`workflow_states.${interview.workflow_state}`)}
                    optionsScope={'workflow_states'}
                    noStatusCheckbox
                />
            </AuthorizedContent>

            <SingleValueWithFormContainer
                obj={interview}
                attribute="startpage_position"
                projectAccessGranted={projectAccessGranted}
                noStatusCheckbox
            />

            <SelectedRegistryReferencesContainer refObject={interview} />
        </div>
    );
}

InterviewInfo.propTypes = {
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
};
