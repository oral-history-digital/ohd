import { useEffect, useState } from 'react';

import { getArchiveId } from 'modules/archive';
import {
    FetchProjectResource,
    fetchData,
    getContributionTypesForCurrentProject,
    getSpeakerDesignationsStatus,
    submitData,
} from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { usePeople } from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads project-owned contribution types before mounting the speaker editor.
 * @param {Object} props - Speaker assignment properties.
 * @param {Object} props.interview - Interview to update.
 * @returns {React.ReactElement} Resource boundary and speaker editor.
 */
export default function AssignSpeakersForm({ interview }) {
    return (
        <FetchProjectResource resource="contribution_types">
            <SpeakerAssignmentFields interview={interview} />
        </FetchProjectResource>
    );
}

/**
 * Selects speaker-assignment state and dispatches updates through Redux.
 * @param {Object} props - Speaker assignment properties.
 * @param {Object} props.interview - Interview to update.
 * @returns {React.ReactElement} Speaker fields or loading feedback.
 */
function SpeakerAssignmentFields({ interview }) {
    const archiveId = useSelector(getArchiveId);
    const contributionTypes = useSelector(
        getContributionTypesForCurrentProject
    );
    const speakerDesignationsStatus = useSelector(getSpeakerDesignationsStatus);
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const [showForm, setShowForm] = useState(true);
    const { t, locale } = useI18n();
    const { data: people, isLoading: peopleAreLoading } = usePeople();

    useEffect(() => {
        if (
            !speakerDesignationsStatus[`for_interviews_${archiveId}`] ||
            speakerDesignationsStatus[`for_interviews_${archiveId}`].split(
                '-'
            )[0] === 'reload'
        ) {
            dispatch(
                fetchData(
                    { pathBase },
                    'interviews',
                    archiveId,
                    'speaker_designations'
                )
            );
        }
    });

    function showContribution(value) {
        const contributor = people[Number.parseInt(value.person_id)];

        return (
            <span>
                <span>{`${contributor?.display_name}, `}</span>
                <span>
                    {contributionTypes[value.contribution_type_id].label[
                        locale
                    ] + ', '}
                </span>
                <span>{value.speaker_designation}</span>
            </span>
        );
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

    const speakerDesignationsLoaded =
        speakerDesignationsStatus[`for_interviews_${archiveId}`] &&
        speakerDesignationsStatus[`for_interviews_${archiveId}`] != 'fetching';

    if (!speakerDesignationsLoaded || peopleAreLoading) {
        return <Spinner withPadding />;
    }

    return (
        <div>
            <div>
                <p>
                    {t(
                        'edit.update_speaker.' +
                            speakerDesignationsStatus[
                                `for_interviews_${archiveId}`
                            ]
                    )}
                </p>
            </div>
            {showForm && (
                <Form
                    scope="update_speaker"
                    onSubmit={(params) => {
                        dispatch(submitData({ pathBase }, params));
                        setShowForm(false);
                    }}
                    helpTextCode="assign_speakers_form"
                    values={{ id: interview.archive_id }}
                    elements={formElements()}
                    nestedScopeProps={[
                        {
                            formComponent:
                                allHiddenSpeakerDesignationsAssigned() &&
                                ContributionFormContainer,
                            formProps: {
                                withSpeakerDesignation: true,
                                interview: interview,
                            },
                            parent: interview,
                            scope: 'contribution',
                            elementRepresentation: showContribution,
                        },
                    ]}
                />
            )}
        </div>
    );
}

AssignSpeakersForm.propTypes = {
    interview: PropTypes.object.isRequired,
};

SpeakerAssignmentFields.propTypes = {
    interview: PropTypes.object.isRequired,
};
