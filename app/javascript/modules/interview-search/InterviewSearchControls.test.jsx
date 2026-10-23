/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';

import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResults from './InterviewSearchResults';
import useInterviewSearch from './useInterviewSearch';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/query-string', () => ({ useSearchParams: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/interview', () => ({
    showTranslationTab: jest.requireActual(
        '../interview/components/showTranslationTab'
    ).default,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./useInterviewSearch', () => jest.fn());
jest.mock(
    './AnnotationResult',
    () =>
        function Annotation() {
            return null;
        }
);
jest.mock(
    './PhotoResult',
    () =>
        function Photo() {
            return null;
        }
);
jest.mock(
    './RegistryResult',
    () =>
        function Registry() {
            return null;
        }
);
jest.mock(
    './TocResult',
    () =>
        function Toc() {
            return null;
        }
);
jest.mock(
    './TranscriptResult',
    () =>
        function Transcript() {
            return null;
        }
);
jest.mock(
    './ResultList',
    () =>
        function Results({ heading, searchResults, locale }) {
            return (
                <p>
                    {heading}: {searchResults.length} {locale}
                </p>
            );
        }
);

const project = { id: 7, shortname: 'pilot' };
const interview = {
    alpha2: 'de',
    alpha3: 'deu',
    translation_alpha3s: ['eng'],
    alpha3s_with_transcript: ['deu', 'eng'],
};
const results = {
    numResults: 1,
    segmentResults: [{ text: { deu: 'Original', eng: 'Translation' } }],
    headingResults: [],
    registryEntryResults: [],
    photoResults: [],
    biographyResults: [],
    annotationResults: [],
    observationsResults: [],
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project });
    useSearchParams.mockReturnValue({
        fulltext: 'Berlin',
        setFulltext: jest.fn(),
    });
    useInterviewSearch.mockReturnValue(results);
});

test('trims submitted terms, clears the query, and disables actions while settings load', () => {
    const setFulltext = jest.fn();
    useSearchParams.mockReturnValue({ fulltext: 'Initial', setFulltext });
    const { rerender } = render(<InterviewSearchForm archiveId="pilot001" />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: ' Berlin ' } });
    fireEvent.submit(input.closest('form'));
    expect(setFulltext).toHaveBeenLastCalledWith('Berlin');
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(setFulltext).toHaveBeenLastCalledWith(undefined);
    expect(input).toHaveValue('');
    useProject.mockReturnValue({ isLoading: true });
    rerender(<InterviewSearchForm archiveId="pilot001" />);
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
    expect(useProject).toHaveBeenCalledWith();
});

test('keeps original and available translated transcript results separate', () => {
    const { rerender } = render(
        <InterviewSearchResults archiveId="pilot001" interview={interview} />
    );
    expect(useInterviewSearch).toHaveBeenCalledWith(
        'pilot001',
        'Berlin',
        project
    );
    expect(screen.getByText('segment_results: 1 deu')).toBeInTheDocument();
    expect(screen.getByText('translation_results: 1 eng')).toBeInTheDocument();
    rerender(
        <InterviewSearchResults
            archiveId="pilot001"
            interview={{ ...interview, alpha3s_with_transcript: ['deu'] }}
        />
    );
    expect(
        screen.queryByText('translation_results: 1 eng')
    ).not.toBeInTheDocument();
});

test('shows loading and project or search errors before retained results', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <InterviewSearchResults archiveId="pilot001" interview={interview} />
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    useProject.mockReturnValue({
        project,
        error: { message: 'Access denied' },
    });
    rerender(
        <InterviewSearchResults archiveId="pilot001" interview={interview} />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(
        screen.queryByText('segment_results: 1 deu')
    ).not.toBeInTheDocument();
    useProject.mockReturnValue({ project });
    useInterviewSearch.mockReturnValue({
        ...results,
        error: { message: 'Search failed' },
    });
    rerender(
        <InterviewSearchResults archiveId="pilot001" interview={interview} />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Search failed');
    useInterviewSearch.mockReturnValue({ numResults: 0 });
    rerender(
        <InterviewSearchResults archiveId="pilot001" interview={interview} />
    );
    expect(
        screen.getByText('modules.interview_search.no_results')
    ).toBeInTheDocument();
});
