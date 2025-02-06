import PropTypes from 'prop-types';

import { SingleValueWithFormContainer } from 'modules/forms';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import InterviewCollectionInfo from './InterviewCollectionInfo';

export default function InterviewInfo({
    interview,
    languages,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    if (!interview?.language_id) {
        return null;
    }

    return (
        <div>
            <SingleValueWithFormContainer
                obj={interview}
                attribute="archive_id"
                value={interview.archive_id}
                readOnly
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                attribute={'signature_original'}
                value={interview.signature_original}
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                attribute={'interview_date'}
                value={interview.interview_date}
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                attribute={'description'}
                value={interview.description?.[locale]}
                elementType="textarea"
                multiLocale
                linkUrls
                hideEmpty
                //collapse
            />
            <SingleValueWithFormContainer
                obj={interview}
                optionsScope={'search_facets'}
                elementType={'select'}
                values={['video', 'audio']}
                value={t(`search_facets.${interview.media_type}`)}
                attribute={'media_type'}
                value={t(interview.media_type)}
            />
            <SingleValueWithFormContainer
                obj={interview}
                attribute="media_missing"
                value={t(`boolean_value.${interview.media_missing}`)}
                elementType="input"
                type="checkbox"
                noStatusCheckbox
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                validate={function(v){return /^[\d{2}:\d{2}:\d{2}.*]{1,}$/.test(v)}}
                attribute={'duration'}
                value={`${interview.duration.split(':')[0]} h ${interview.duration.split(':')[1]} min`}
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                validate={function(v){return /^\d+$/.test(v)}}
                attribute={'tape_count'}
                value={interview.tape_count}
                hideEmpty
            />
            <SingleValueWithFormContainer
                obj={interview}
                elementType='input'
                type='checkbox'
                attribute={'transcript_coupled'}
                value={t(`boolean_value.${interview.transcript_coupled}`)}
                hideEmpty
            />
            { ['primary_language_id', 'secondary_language_id', 'primary_translation_language_id'].map((attribute) => (
                <SingleValueWithFormContainer
                    elementType={'select'}
                    obj={interview}
                    values={languages}
                    withEmpty={true}
                    //validate={function(v){return /^\d+$/.test(v)}}
                    attribute={attribute}
                    value={languages[interview[attribute]]?.name[locale]}
                    hideEmpty
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
                value={interview.startpage_position}
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
