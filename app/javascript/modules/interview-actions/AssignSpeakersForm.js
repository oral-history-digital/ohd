import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { usePeople } from 'modules/person';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { ContributionFormContainer } from 'modules/interview-metadata';

export default function AssignSpeakersForm({
    archiveId,
    contributionTypes,
    fetchData,
    interview,
    projectId,
    project,
    speakerDesignationsStatus,
    submitData,
}) {
    const [showForm, setShowForm] = useState(true);
    const { t, locale } = useI18n();
    const { data: people, isLoading: peopleAreLoading } = usePeople();

    useEffect(() => {
        if (
            !speakerDesignationsStatus[`for_interviews_${archiveId}`] ||
            speakerDesignationsStatus[`for_interviews_${archiveId}`].split('-')[0] === 'reload'
        ) {
            fetchData({ locale, projectId, project }, 'interviews', archiveId, 'speaker_designations');
        }
    });

    function showContribution(value) {
        const contributor = people[Number.parseInt(value.person_id)];

        return (
            <span>
                <span>
                    {`${contributor?.display_name}, `}
                </span>
                <span>
                    {contributionTypes[value.contribution_type_id].label[locale] + ', '}
                </span>
                <span>{value.speaker_designation}</span>
            </span>
        )
    }

    function formElements() {
        let elements = [];
        for (var i in interview.speaker_designations) {
            elements.push({
                elementType: 'select',
                attribute: `[speakers]${interview.speaker_designations[i]}`,
                label: `${t('edit.update_speaker.speaker_for_speaker_designation')} ${interview.speaker_designations[i]}`,
                values: Object.values(people),
                withEmpty: true,
            });
        }
        return elements;
    }

    //
    // hidden speaker designations are those written in column 'speaker' from table 'segments'
    //
    function allHiddenSpeakerDesignationsAssigned() {
        return Object.keys(interview.speaker_designations).length < 1;
    }

    const speakerDesignationsLoaded = speakerDesignationsStatus[`for_interviews_${archiveId}`] &&
        speakerDesignationsStatus[`for_interviews_${archiveId}`] != 'fetching';

    if (!speakerDesignationsLoaded || peopleAreLoading) {
        return <Spinner withPadding />;
    }

    return (
        <div>
            <div>
                <p>
                    {t('edit.update_speaker.' + speakerDesignationsStatus[`for_interviews_${archiveId}`])}
                </p>
            </div>
            {showForm && (
                <Form
                    scope='update_speaker'
                    onSubmit={params => {
                        submitData({ locale, projectId, project }, params);
                        setShowForm(false);
                    }}
                    helpTextCode="assign_speakers_form"
                    values={{ id: interview.archive_id }}
                    elements={formElements()}
                    nestedScopeProps={[{
                        formComponent: allHiddenSpeakerDesignationsAssigned() && ContributionFormContainer,
                        formProps: {withSpeakerDesignation: true, interview: interview},
                        parent: interview,
                        scope: 'contribution',
                        elementRepresentation: showContribution,
                    }]}
                />
            )}
        </div>
    );
}

AssignSpeakersForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
    contributionTypes: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    interview: PropTypes.object.isRequired,
    projectId: PropTypes.number.isRequired,
    project: PropTypes.object.isRequired,
    speakerDesignationsStatus: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
};
