/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProject, useProjectIdentity } from 'modules/routes';

import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    useProjectIdentity: jest.fn(),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/registry', () => ({
    RegistrySearchFormContainer: () => <p>Registry search</p>,
}));
jest.mock(
    './DownloadRegistryEntries',
    () =>
        function Download({ specificLocale, format }) {
            return <p>{`${specificLocale}-${format}`}</p>;
        }
);

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { available_locales: ['en'] } });
});

test.each([
    ['adg', true, false, 1],
    ['other', false, true, 0],
])(
    'uses %s identity for the view toggle and project-specific link',
    (shortname, showResults, nextView, linkCount) => {
        useProjectIdentity.mockReturnValue({ projectShortname: shortname });
        const changeRegistryEntriesViewMode = jest.fn();
        render(
            <RegistryEntriesTabPanel
                showRegistryEntriesSearchResults={showResults}
                changeRegistryEntriesViewMode={changeRegistryEntriesViewMode}
            />
        );
        expect(screen.getByText('Registry search')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(changeRegistryEntriesViewMode).toHaveBeenCalledWith(
            nextView,
            shortname
        );
        expect(screen.queryAllByRole('link')).toHaveLength(linkCount);
    }
);

test('download locales follow loaded project settings while registry controls remain usable', () => {
    useProjectIdentity.mockReturnValue({ projectShortname: 'other' });
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <RegistryEntriesTabPanel
            showRegistryEntriesSearchResults={false}
            changeRegistryEntriesViewMode={jest.fn()}
        />
    );
    expect(screen.getByText('Registry search')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    useProject.mockReturnValue({
        project: { available_locales: ['de', 'en'] },
    });
    rerender(
        <RegistryEntriesTabPanel
            showRegistryEntriesSearchResults={false}
            changeRegistryEntriesViewMode={jest.fn()}
        />
    );
    expect(screen.getByText('de-pdf')).toBeInTheDocument();
    expect(screen.getByText('en-csv')).toBeInTheDocument();
    useProject.mockReturnValue({ error: { message: 'Denied' } });
    rerender(
        <RegistryEntriesTabPanel
            showRegistryEntriesSearchResults={false}
            changeRegistryEntriesViewMode={jest.fn()}
        />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Denied');
    expect(screen.queryByText('de-pdf')).not.toBeInTheDocument();
});
