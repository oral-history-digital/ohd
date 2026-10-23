/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import UpdateRegistryEntryAttributesModal from './UpdateRegistryEntryAttributesModal';
import * as importHelpers from './updateRegistryEntryAttributes';

const mockClose = jest.fn();
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p>Loading project</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    Modal: ({ trigger, children }) => (
        <section>
            <p>{trigger}</p>
            {children(mockClose)}
        </section>
    ),
}));

const project = { id: 12, available_locales: ['de'] };
const props = {
    entry: {
        Name: 'Default name',
        Country: 'DE',
        Location: { Latitude: 12, Longitude: 34 },
        AlternativeNames: {
            AlternativeName: [
                { Lang: 'de', Name: 'Deutscher Name' },
                { Lang: 'en', Name: 'English name' },
            ],
        },
        Description: [
            { Lang: 'de', Description: 'Deutsche Notiz' },
            { Lang: 'en', Description: 'English note' },
        ],
        Identifier: [{ Provider: 'GND', Value: '123' }],
    },
    apiSearchTerm: 'Search term',
    registryEntryAttributes: { translations_attributes: [] },
    registryNameTypes: {
        5: { id: 5, code: 'spelling' },
        6: { id: 6, code: 'ancient' },
    },
    normDataProviders: { 8: { id: 8, name: 'GND' } },
    setRegistryEntryAttributes: jest.fn(),
    setShowElementsInForm: jest.fn(),
    setResultsFromNormDataSet: jest.fn(),
    replaceNestedFormValues: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project });
});
afterEach(() => jest.restoreAllMocks());

test('waits for project locales and blocks imports after a denied read', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <UpdateRegistryEntryAttributesModal {...props} />
    );
    expect(useProject).toHaveBeenCalledWith();
    expect(screen.getByText('Loading project')).toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'ok' })
    ).not.toBeInTheDocument();
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<UpdateRegistryEntryAttributesModal {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(
        screen.queryByRole('button', { name: 'ok' })
    ).not.toBeInTheDocument();
    expect(props.setRegistryEntryAttributes).not.toHaveBeenCalled();
});

test('uses configured project locales for imports and preserves nested updates and completion callbacks', () => {
    const prepareNotes = jest.spyOn(
        importHelpers,
        'updateRegistryEntryTranslationsAttributes'
    );
    render(<UpdateRegistryEntryAttributesModal {...props} />);
    expect(screen.getByText('English name, English note')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'ok' }));
    expect(props.setRegistryEntryAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
            api_search_term: 'Search term',
            latitude: 12,
            longitude: 34,
            has_geo_coords: true,
            delete_persistent_values: true,
        })
    );
    expect(prepareNotes).toHaveBeenCalledWith(props.entry, project, []);
    expect(
        prepareNotes.mock.results[0].value.translations_attributes.map(
            ({ locale }) => locale
        )
    ).toEqual(['de']);
    const names = props.replaceNestedFormValues.mock.calls.find(
        ([scope]) => scope === 'registry_names_attributes'
    )[1];
    expect(
        names[0].translations_attributes.map(({ locale, descriptor }) => [
            locale,
            descriptor,
        ])
    ).toEqual([
        ['de', 'Deutscher Name'],
        ['orig', 'Deutscher Name'],
    ]);
    expect(props.replaceNestedFormValues).toHaveBeenCalledWith(
        'norm_data_attributes',
        [expect.objectContaining({ norm_data_provider_id: 8, nid: '123' })]
    );
    expect(props.setShowElementsInForm).toHaveBeenCalledWith(true);
    expect(props.setResultsFromNormDataSet).toHaveBeenCalledWith(true);
    expect(mockClose).toHaveBeenCalledTimes(1);
});

test('cancelling closes the dialog without changing entry attributes or nested forms', () => {
    render(<UpdateRegistryEntryAttributesModal {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(props.setRegistryEntryAttributes).not.toHaveBeenCalled();
    expect(props.replaceNestedFormValues).not.toHaveBeenCalled();
});
