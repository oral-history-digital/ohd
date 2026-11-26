import { createElement, useEffect, useRef } from 'react';

import { Element, InputField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import { suggestSpeakerMappings } from './utils';

/**
 * Maps interview participants to file labels, suggesting only unambiguous matches.
 * @param {Object} props - Contributions, optional file labels, and form callbacks.
 * @returns {React.ReactElement} Speaker selects or manual designation fields.
 */
export default function SpeakerDesignationInputs({
    attribute,
    value: contributions,
    handleChange,
    speakerOptions,
    speakerOptionsLoading,
    labelPosition,
}) {
    const { t } = useI18n();
    const { data: people, isLoading } = usePeople();
    const edited = useRef(new Set());

    useEffect(() => {
        if (!speakerOptions?.length || isLoading || !people) return;

        const next = suggestSpeakerMappings(
            contributions,
            people,
            speakerOptions,
            edited.current
        );
        if (
            next.some(
                (contribution, index) =>
                    contribution.speaker_designation !==
                    (contributions[index].speaker_designation || '')
            )
        ) {
            handleChange(attribute, next);
        }
    }, [
        speakerOptions,
        people,
        isLoading,
        contributions,
        handleChange,
        attribute,
    ]);

    /**
     * Retains explicit user mappings, including clearing a selection.
     * @param {string} name - Contribution ID.
     * @param {string} value - Selected or manually entered designation.
     */
    const onChange = (name, value) => {
        const selected = contributions.find(
            (contribution) => contribution.id.toString() === name
        );
        if (selected) {
            edited.current.add(selected.id);
            handleChange(
                attribute,
                contributions.map((c) => {
                    if (c.id.toString() === name) {
                        return { ...c, speaker_designation: value };
                    }
                    return c;
                })
            );
        }
    };

    if (isLoading || !people || speakerOptionsLoading) {
        return <Spinner />;
    }

    return (
        <div
            className="speaker-designation-input"
            data-testid={`${attribute}-speaker-designation-input`}
        >
            <h4>{t('speaker_designations')}</h4>
            {contributions.map((contribution) => {
                const contributor = people[contribution.person_id];
                const label = contributor?.display_name;
                const id = `${attribute}_${contribution.id}`;
                if (speakerOptions?.length) {
                    const current = contribution.speaker_designation || '';
                    const options =
                        speakerOptions.includes(current) || !current
                            ? speakerOptions
                            : [...speakerOptions, current];
                    return (
                        <Element
                            key={contribution.id}
                            scope={attribute}
                            attribute={String(contribution.id)}
                            htmlFor={id}
                            label={label}
                            labelPosition={labelPosition}
                            elementType="select"
                        >
                            <select
                                id={id}
                                className="Input"
                                value={current}
                                onChange={(event) =>
                                    onChange(
                                        String(contribution.id),
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">{t('choose')}</option>
                                {options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </Element>
                    );
                }
                return createElement(InputField, {
                    key: contribution.id,
                    scope: attribute,
                    attribute: String(contribution.id),
                    label,
                    labelPosition,
                    value: contribution.speaker_designation,
                    handleChange: onChange,
                });
            })}
        </div>
    );
}

SpeakerDesignationInputs.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    speakerOptions: PropTypes.arrayOf(PropTypes.string),
    speakerOptionsLoading: PropTypes.bool,
    labelPosition: PropTypes.oneOf(['above', 'beside']),
    accept: PropTypes.string,
    elementType: PropTypes.string,
    condition: PropTypes.bool,
};
