import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';

import ImportForm from './ImportForm';

jest.mock('modules/routes', () => ({ usePathBase: () => '/adg/de' }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));
jest.mock('modules/person', () => ({
    usePeople: () => ({
        data: { 1: { display_name: 'Alice Miller', initials: 'AM' } },
    }),
}));

test('discovers file speakers and submits suggested mappings to both validation and import', async () => {
    window.fetch = jest.fn().mockImplementation((url) =>
        Promise.resolve({
            status: 200,
            json: async () =>
                url.endsWith('/speakers')
                    ? { speakers: ['IP_AM', 'INT'] }
                    : { valid: true, issues: [] },
        })
    );
    const submitData = jest.fn();
    render(
        <ImportForm
            scope="edit_table"
            resource="edit_tables"
            onCancel={jest.fn()}
            submitData={submitData}
            submitText="import"
            values={{
                archive_id: 'adg001',
                contributions_attributes: [
                    { id: 10, person_id: 1, speaker_designation: '' },
                ],
            }}
            elements={[
                {
                    attribute: 'data',
                    type: 'file',
                    elementType: 'input',
                    validate: (value) => value instanceof File,
                },
                {
                    attribute: 'contributions_attributes',
                    elementType: 'speakerDesignationInputs',
                },
            ]}
        />
    );
    fireEvent.change(
        screen.getByLabelText(/activerecord.attributes.edit_table.data/, {
            selector: 'input',
        }),
        {
            target: { files: [new File(['csv'], 'table.csv')] },
        }
    );
    await waitFor(() =>
        expect(
            screen.getByRole('combobox', { name: 'Alice Miller' })
        ).toHaveValue('IP_AM')
    );
    expect(fetch.mock.calls[0][0]).toBe('/adg/de/edit_tables/speakers');
    fireEvent.change(screen.getByRole('combobox', { name: 'Alice Miller' }), {
        target: { value: 'INT' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'import' }));
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[1][0]).toBe('/adg/de/edit_tables/validate');
    expect(
        fetch.mock.calls[1][1].body.get(
            'edit_table[contributions_attributes][0][speaker_designation]'
        )
    ).toBe('INT');
    expect(
        submitData.mock.calls[0][1].edit_table.contributions_attributes
    ).toEqual([{ id: 10, person_id: 1, speaker_designation: 'INT' }]);
    await act(async () => submitData.mock.calls[0][3]());
    expect(screen.getByText('import_validation.queued')).toBeInTheDocument();
});
