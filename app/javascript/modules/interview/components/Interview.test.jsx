/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import Interview from './Interview';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('react-router-dom', () => ({
    useParams: () => ({ archiveId: 'pilot001' }),
}));
jest.mock('modules/analytics', () => ({ useTrackPageView: jest.fn() }));
jest.mock('modules/auth', () => ({
    AuthShowContainer: ({ hasProjectAccess, children }) =>
        hasProjectAccess ? children : null,
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/edit-table', () => ({
    EditTableLoader: () => <p>Editing table</p>,
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/media-player', () => ({ MediaPlayer: () => <p>Player</p> }));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('react-helmet', () => ({ Helmet: () => null }));
jest.mock('../useLoadInterviewData', () => jest.fn());
jest.mock(
    './InterviewDetailsLeftSideContainer',
    () =>
        function CatalogDetailsMock() {
            return <p>Catalog details</p>;
        }
);
jest.mock(
    './InterviewTabsContainer',
    () =>
        function InterviewTabsMock() {
            return <p>Interview tabs</p>;
        }
);
jest.mock(
    './MediaPreview',
    () =>
        function MediaPreviewMock() {
            return <p>Preview</p>;
        }
);

const props = {
    interview: {
        id: 7,
        archive_id: 'pilot001',
        alpha3: 'ger',
        contributions: { 1: { id: 1 } },
    },
    interviewIsFetched: true,
    interviewEditView: false,
    setArchiveId: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

test('waits for project settings and fails closed before choosing the interview workspace', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<Interview {...props} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Player')).not.toBeInTheDocument();
    expect(props.setArchiveId).toHaveBeenCalledWith('pilot001');
    useProject.mockReturnValue({ error: { message: 'Denied' } });
    rerender(<Interview {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Denied');
});

test.each([
    [true, 'Catalog details'],
    [false, 'Interview tabs'],
])('project catalog flag %s selects the existing view', (isCatalog, view) => {
    useProject.mockReturnValue({ project: { is_catalog: isCatalog } });
    render(<Interview {...props} />);
    expect(useProject).toHaveBeenCalledWith();
    expect(screen.getByText(view)).toBeInTheDocument();
});
