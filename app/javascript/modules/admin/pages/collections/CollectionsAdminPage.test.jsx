/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';

import CollectionsAdminPage from './CollectionsAdminPage';

const mockSubmitData = jest.fn();
const mockClose = jest.fn();
const mockMutate = jest.fn();
const mockCollection = {
    id: 4,
    type: 'Collection',
    publication_date: '2024',
    workflow_state: 'public',
    logos: {
        1: { locale: 'en', filename: 'english.png', src: '/en.png' },
        2: { locale: 'de', filename: 'german.png', src: '/de.png' },
    },
};

jest.mock('modules/routes', () => ({
    usePathBase: () => '/test/en',
    useProject: () => ({ project: { available_locales: ['de', 'en'] } }),
    useProjectIdentity: () => ({ projectDbId: 1 }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => ({}),
}));
jest.mock('swr', () => ({ useSWRConfig: () => ({ mutate: mockMutate }) }));
jest.mock('../../hooks', () => ({
    useAdminDataActions: () => ({ submitData: mockSubmitData }),
}));
jest.mock('../../components', () => ({
    PaginatedAdminRecordList: ({ form: Editor, initialFormValues }) => (
        <Editor
            data={mockCollection}
            values={initialFormValues}
            onSubmit={mockClose}
        />
    ),
}));

beforeEach(() => jest.clearAllMocks());

test('shows both logo fields and saves replacements in one collection update', () => {
    render(<CollectionsAdminPage />);
    expect(screen.getByText('english.png')).toBeInTheDocument();
    expect(screen.getByText('german.png')).toBeInTheDocument();
    expect(
        screen.queryByRole('combobox', {
            name: 'activerecord.attributes.logo.locale',
        })
    ).not.toBeInTheDocument();

    const german = new File(['image'], 'de.png', { type: 'image/png' });
    const english = new File(['image'], 'en.png', { type: 'image/png' });
    fireEvent.change(
        screen.getByLabelText('activerecord.models.logo.one (de)', {
            selector: 'input',
        }),
        { target: { files: [german] } }
    );
    fireEvent.change(
        screen.getByLabelText('activerecord.models.logo.one (en)', {
            selector: 'input',
        }),
        { target: { files: [english] } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(mockSubmitData).toHaveBeenCalledWith(
        { pathBase: '/test/en' },
        {
            collection: expect.objectContaining({
                id: 4,
                logo_changes: { de: { file: german }, en: { file: english } },
            }),
        },
        undefined,
        expect.any(Function)
    );
    expect(mockClose).not.toHaveBeenCalled();

    mockSubmitData.mock.lastCall[3]();
    expect(mockClose).toHaveBeenCalled();
    expect(
        mockMutate.mock.lastCall[0]('/test/de/collections/4.json?lite=1')
    ).toBe(true);
});
