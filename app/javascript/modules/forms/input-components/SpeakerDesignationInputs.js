import { createElement } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import InputContainer from './InputContainer';

export default function SpeakerDesignationInputs({
    attribute,
    value: contributions,
    handleChange,
}) {
    const { t } = useI18n();
    const { data: people, isLoading } = usePeople();

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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="speaker-designation-input">
            <h4>{t('speaker_designations')}</h4>
            {
                contributions.map(contribution => {
                    const contributor = people[contribution.person_id];
                    const label = contributor?.display_name;
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
    );
}

SpeakerDesignationInputs.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
};
