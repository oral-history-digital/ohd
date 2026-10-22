/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useInterviewSearch } from 'modules/interview-search';
import { useProject } from 'modules/routes';

import InterviewTabs from './InterviewTabs';

let mockLocale = 'de';
let mockFulltext;
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: mockLocale, t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/query-string', () => ({
    useSearchParams: () => ({ fulltext: mockFulltext }),
}));
jest.mock('modules/interview-search', () => ({
    useInterviewSearch: jest.fn(),
    InterviewSearchContainer: () => <p>Search results</p>,
}));
jest.mock('modules/interview-references', () => ({
    RefTreeContainer: () => null,
}));
jest.mock('modules/toc', () => ({
    TableOfContentsContainer: () => <p>Contents</p>,
}));
jest.mock('modules/transcript', () => ({
    Transcript: ({ transcriptLocale }) => <p>Transcript {transcriptLocale}</p>,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./LocaleSwitch', () => jest.fn(() => null));

const project = { shortname: 'adg' };
const interview = {
    archive_id: 'adg001',
    alpha2: 'en',
    alpha3: 'eng',
    translation_alpha3: 'ger',
    translation_alpha3s: ['ger'],
    alpha3s_with_transcript: ['eng', 'ger'],
    toc_alpha3s: ['eng', 'ger'],
};

beforeEach(() => {
    jest.clearAllMocks();
    mockLocale = 'de';
    mockFulltext = undefined;
    useProject.mockReturnValue({ project });
    useInterviewSearch.mockReturnValue({ numResults: 0 });
});

test('delayed project details select the translated transcript, then preserve the selected tab', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<InterviewTabs interview={interview} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(useInterviewSearch).toHaveBeenLastCalledWith(
        'adg001',
        undefined,
        undefined
    );
    useProject.mockReturnValue({ project });
    rerender(<InterviewTabs interview={interview} />);
    expect(useProject).toHaveBeenCalledWith({});
    expect(screen.getByRole('tab', { name: 'translation' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
    expect(screen.getByText('Transcript ger')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'table_of_contents' }));
    useProject.mockReturnValue({ project: { ...project } });
    rerender(<InterviewTabs interview={interview} />);
    expect(
        screen.getByRole('tab', { name: 'table_of_contents' })
    ).toHaveAttribute('aria-selected', 'true');
    mockLocale = 'fr';
    rerender(<InterviewTabs interview={interview} />);
    expect(screen.getByTestId('interview-tab-transcript')).toHaveAttribute(
        'aria-selected',
        'true'
    );
    expect(
        screen.getByRole('tab', { name: 'table_of_contents' })
    ).toBeDisabled();
});

test('initial matching search results take priority over the translated transcript', () => {
    mockFulltext = 'history';
    useInterviewSearch.mockReturnValue({ numResults: 2 });
    render(<InterviewTabs interview={interview} />);
    expect(
        screen.getByRole('tab', { name: 'interview_search' })
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Search results')).toBeInTheDocument();
});

test('failed project reads hide retained tabs and stop interview search', () => {
    const { rerender } = render(<InterviewTabs interview={interview} />);
    useProject.mockReturnValue({
        project,
        error: { message: 'Access denied' },
    });
    rerender(<InterviewTabs interview={interview} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(useInterviewSearch).toHaveBeenLastCalledWith(
        'adg001',
        undefined,
        undefined
    );
});
