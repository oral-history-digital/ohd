/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { useProject } from 'modules/routes';

import RegistryEntrySelect from './input/RegistryEntrySelect';
import SelectField from './input/SelectField';
import MultiLocaleWrapper from './shared/MultiLocaleWrapper';

const mockDispatch = jest.fn();
let mockEntries = {};
let mockStatuses = {};
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/adg/en',
}));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH' })),
    getRegistryEntries: () => mockEntries,
    getRegistryEntriesStatus: () => mockStatuses,
}));
jest.mock('react-redux', () => ({
    useSelector: (select) => select({}),
    useDispatch: () => mockDispatch,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./input', () => ({
    InputField: ({ label, value, handleChange, data }) => (
        <input
            aria-label={label}
            value={value || ''}
            onChange={(event) => handleChange('text', event.target.value, data)}
        />
    ),
    RichTextarea: () => null,
    Textarea: () => null,
}));
jest.mock('./input/SelectField', () => ({
    __esModule: true,
    default: jest.fn(() => <p>Registry choices</p>),
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockEntries = {};
    mockStatuses = {};
});

test('translated fields wait for project locales and preserve translation IDs on edits', () => {
    useProject.mockReturnValue({ isLoading: true });
    const handleChange = jest.fn();
    const props = {
        attribute: 'text',
        elementType: 'input',
        scope: 'text',
        data: {
            translations_attributes: [
                { id: 3, locale: 'en', text: 'Original' },
                { id: 4, locale: 'de', text: 'Deutsch' },
            ],
        },
        handleChange,
    };
    const { rerender } = render(<MultiLocaleWrapper {...props} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    useProject.mockReturnValue({
        project: { available_locales: ['en', 'de'] },
    });
    rerender(<MultiLocaleWrapper {...props} />);
    expect(screen.getAllByRole('textbox').map((input) => input.value)).toEqual([
        'Original',
        'Deutsch',
    ]);
    fireEvent.change(screen.getAllByRole('textbox')[0], {
        target: { value: 'Updated' },
    });
    expect(handleChange).toHaveBeenCalledWith(
        null,
        null,
        { translation: { text: 'Updated', locale: 'en', id: 3 } },
        'locale'
    );
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<MultiLocaleWrapper {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

test('registry selector starts at the configured root after details load and uses route-based requests', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <RegistryEntrySelect attribute="registry_entry_id" />
    );
    expect(fetchData).not.toHaveBeenCalled();
    useProject.mockReturnValue({ project: { root_registry_entry_id: 7 } });
    rerender(<RegistryEntrySelect attribute="registry_entry_id" />);
    expect(useProject).toHaveBeenCalledWith({
        include: ['registry_configuration'],
    });
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        'registry_entries',
        7,
        null,
        'with_associations=true'
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        'registry_entries',
        null,
        null,
        'children_for_entry=7'
    );
});

test('registry selector excludes numeric hidden IDs from transcript choices', () => {
    useProject.mockReturnValue({
        project: {
            root_registry_entry_id: 7,
            hidden_transcript_registry_entry_ids: [8],
        },
    });
    mockEntries = {
        7: {
            name: { en: 'Root' },
            associations_loaded: true,
            child_ids: { en: ['8', '9'] },
        },
        8: { id: 8 },
        9: { id: 9 },
    };
    mockStatuses = { 7: 'fetched', children_for_entry_7: 'fetched' };
    render(<RegistryEntrySelect attribute="registry_entry_id" inTranscript />);
    expect(SelectField.mock.lastCall[0].values).toEqual([{ id: 9 }]);
});
