/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useTrackSiteSearch } from 'modules/analytics';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';

import ArchiveSearchForm from './ArchiveSearchForm';

jest.mock('modules/analytics', () => ({ useTrackSiteSearch: jest.fn() }));
jest.mock('modules/auth', () => ({
    AuthShowContainer: ({ children }) => children,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/query-string', () => ({ useSearchParams: jest.fn() }));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    ResetFiltersButton: ({ onClick }) => (
        <button onClick={onClick}>Reset</button>
    ),
}));
jest.mock('modules/user-agent', () => ({ isMobile: () => false }));
jest.mock('../useSearchSuggestions', () => () => ({}));
jest.mock(
    './ArchiveFacets',
    () =>
        function ArchiveFacets() {
            return <p>Facets</p>;
        }
);

let params;
const trackSiteSearch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useTrackSiteSearch.mockReturnValue(trackSiteSearch);
    useProject.mockReturnValue({ project: { default_search_order: 'random' } });
    params = {
        fulltext: 'old search',
        fulltextIsSet: true,
        facets: {},
        yearOfBirthMin: NaN,
        yearOfBirthMax: NaN,
        interviewYearMin: NaN,
        interviewYearMax: NaN,
        setFulltextAndSort: jest.fn(),
        resetSearchParams: jest.fn(),
    };
    useSearchParams.mockImplementation(() => params);
});

test('waits for settings and shows project errors before allowing search submission', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <ArchiveSearchForm projectId="history" hideSidebar={jest.fn()} />
    );
    expect(useProject).toHaveBeenCalledWith({});
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(
        screen.queryByPlaceholderText('enter_field')
    ).not.toBeInTheDocument();
    expect(params.setFulltextAndSort).not.toHaveBeenCalled();

    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<ArchiveSearchForm projectId="history" hideSidebar={jest.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(
        screen.queryByPlaceholderText('enter_field')
    ).not.toBeInTheDocument();
});

test('uses relevance for text, the project default for empty input, and preserves reset', () => {
    render(<ArchiveSearchForm projectId="history" hideSidebar={jest.fn()} />);
    const input = screen.getByPlaceholderText('enter_field');
    fireEvent.change(input, { target: { value: '  new search  ' } });
    fireEvent.submit(input.closest('form'));
    expect(params.setFulltextAndSort).toHaveBeenLastCalledWith(
        'new search',
        'score',
        'desc'
    );
    expect(trackSiteSearch).toHaveBeenCalledWith('new search');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form'));
    expect(params.setFulltextAndSort).toHaveBeenLastCalledWith(
        undefined,
        'random',
        undefined
    );
    expect(input).toHaveValue('');
    expect(screen.getByText('Facets')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(params.resetSearchParams).toHaveBeenCalledTimes(1);
});
