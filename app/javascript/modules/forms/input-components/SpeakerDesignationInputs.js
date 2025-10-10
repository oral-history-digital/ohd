import { createElement } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import InputContainer from './InputContainer';
import { getCurrentInterview } from 'modules/data';

export default function SpeakerDesignationInputs({
    attribute,
    value: contributions,
    handleChange,
}) {
    const { t } = useI18n();
    const interview = useSelector(getCurrentInterview);
    const people = interview.contributors;

    const onChange = (name, v) => {
        if (v) {
            handleChange(
                attribute,
                contributions.map(c => {
                    if (c.id.toString() === name) {
                        return { ...c, speaker_designation: v };
                    }
                    return c;
                })
            );
        }
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
