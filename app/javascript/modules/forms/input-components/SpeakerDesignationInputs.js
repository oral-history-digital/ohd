import { createElement } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getPeopleForCurrentProject, getPeopleForCurrentProjectFetched,
    getCurrentProject, Fetch } from 'modules/data';
import { fullName } from 'modules/people';
import InputContainer from './InputContainer';

export default function SpeakerDesignationInputs({
    attribute,
    value: contributions,
    handleChange,
}) {
    const { t, locale } = useI18n();
    const people = useSelector(getPeopleForCurrentProject);
    const project = useSelector(getCurrentProject);

    const onChange = (name, v) => {
        const index = contributions.findIndex(c => c.id.toString() === name);
        const updatedContribution = {
            ...contributions[index],
            speaker_designation: v,
        };

        const updatedContributions = [
            ...contributions.slice(0, index),
            updatedContribution,
            ...contributions.slice(index + 1),
        ];

        handleChange(attribute, updatedContributions);
    }

    return (
        <Fetch
            fetchParams={['people', null, null, `for_projects=${project?.id}`]}
            testSelector={getPeopleForCurrentProjectFetched}
        >
            <div className="speaker-designation-input">
                <h4>{t('speaker_designations')}</h4>
                {
                    contributions.map(contribution => {
                        const label = fullName(people[contribution.person_id], locale);
                        return createElement(InputContainer, {
                            key: contribution.id,
                            scope: attribute,
                            attribute: contribution.id,
                            label,
                            value: contribution.speaker_designation,
                            handleChange: onChange,
                        });
                    })
                }
            </div>
        </Fetch>
    );
}

SpeakerDesignationInputs.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
};
