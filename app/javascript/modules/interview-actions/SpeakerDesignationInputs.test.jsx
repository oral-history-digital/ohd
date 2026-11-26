/* eslint-disable react/prop-types */
import { useState } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SpeakerDesignationInputs from './SpeakerDesignationInputs';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));
jest.mock('modules/person', () => ({
    usePeople: () => ({
        data: {
            1: { display_name: 'Alice Miller', initials: 'AM' },
            2: { display_name: 'Bob Hill', initials: 'BH' },
            3: { display_name: 'Carol Hill', initials: 'BH' },
        },
    }),
}));

/**
 * Keeps mapping edits in state as the real form does.
 * @param {Object} props - Initial contributions and discovered file labels.
 * @returns {React.ReactElement} Mapping controls.
 */
function MappingForm({ contributions, ...props }) {
    const [values, setValues] = useState(contributions);
    return (
        <SpeakerDesignationInputs
            {...props}
            attribute="contributions_attributes"
            value={values}
            handleChange={(_name, next) => setValues(next)}
        />
    );
}

test('applies suggestions to the selects and allows clearing a mapping', async () => {
    render(
        <MappingForm
            contributions={[
                { id: 10, person_id: 1, speaker_designation: 'INT' },
                { id: 20, person_id: 2, speaker_designation: '' },
            ]}
            speakerOptions={['INT', 'IP_AM', 'IP_BH']}
        />
    );
    expect(screen.getByRole('combobox', { name: 'Alice Miller' })).toHaveValue(
        'INT'
    );
    await waitFor(() =>
        expect(screen.getByRole('combobox', { name: 'Bob Hill' })).toHaveValue(
            'IP_BH'
        )
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Bob Hill' }), {
        target: { value: '' },
    });
    expect(screen.getByRole('combobox', { name: 'Bob Hill' })).toHaveValue('');
});

test('retains manual edits when discovered options arrive or change', () => {
    const contributions = [{ id: 10, person_id: 1, speaker_designation: '' }];
    const { rerender } = render(
        <MappingForm contributions={contributions} speakerOptions={null} />
    );
    fireEvent.change(screen.getByLabelText('Alice Miller'), {
        target: { value: 'CUSTOM' },
    });
    rerender(
        <MappingForm contributions={contributions} speakerOptions={['AM']} />
    );
    expect(screen.getByRole('combobox', { name: 'Alice Miller' })).toHaveValue(
        'CUSTOM'
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Alice Miller' }), {
        target: { value: 'AM' },
    });
    rerender(
        <MappingForm contributions={contributions} speakerOptions={['IP_AM']} />
    );
    expect(screen.getByRole('combobox', { name: 'Alice Miller' })).toHaveValue(
        'AM'
    );
});

test('falls back to text fields when the file contains no speaker labels', () => {
    render(
        <MappingForm
            contributions={[
                { id: 10, person_id: 1, speaker_designation: 'INT' },
            ]}
            speakerOptions={[]}
        />
    );
    expect(screen.getByRole('textbox', { name: 'Alice Miller' })).toHaveValue(
        'INT'
    );
});
