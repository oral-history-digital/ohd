import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18n } from 'bundles/archive/hooks/i18n';
import { getPeople } from 'modules/data';
import { fullname } from 'lib/utils';
import InputContainer from './InputContainer';

export default function SpeakerDesignationInputs({
    attribute,
    value: contributions,
    handleChange,
}) {
    const { t, locale } = useI18n();
    const people = useSelector(getPeople);

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
        <div className="speaker-designation-input">
            <h4>{t('speaker_designations')}</h4>
            {
                contributions.map(contribution => React.createElement(InputContainer, {
                    key: contribution.id,
                    scope: attribute,
                    attribute: contribution.id,
                    label: fullname({ locale }, people[contribution.person_id]),
                    value: contribution.speaker_designation,
                    handleChange: onChange,
                }))
            }
        </div>
    );
}

SpeakerDesignationInputs.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
};
