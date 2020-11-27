import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import InputContainer from '../../containers/form/InputContainer';
import { useI18n } from '../../hooks/i18n';
import { getPeople } from '../../selectors/dataSelectors';
import { fullname } from 'lib/utils';

export default function SpeakerDesignationInputs(props) {
    const { t, locale } = useI18n();
    const people = useSelector(getPeople);

    const label = () => {
        let mandatory = props.mandatory ? ' *' : '';
        let label = props.label ?
            props.label :
            t(`activerecord.attributes.${props.scope}.${props.attribute}`);
        return label + mandatory;
    }

    return (
        <div className="speaker-designation-input">
            <h4>Sprecherzuordnungen</h4>
            {
                props.value.map(contribution => {
                    return React.createElement(InputContainer, {
                        scope: props.attribute,
                        key: contribution.id,
                        attribute: contribution.id,
                        label: fullname({ locale }, people[contribution.person_id]),
                        value: contribution.speaker_designation,
                        validate: props.validate,
                        handleChange: console.log,
                        handleErrors: console.log,
                    });
                })
            }
        </div>
    );
}

SpeakerDesignationInputs.propTypes = {
    value: PropTypes.array.isRequired,
    mandatory: PropTypes.bool,
    label: PropTypes.string,
    scope: PropTypes.string,
    attribute: PropTypes.string.isRequired,
    validate: PropTypes.func,
};
