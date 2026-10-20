/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import MediaPreview from './MediaPreview';

let mockInterview;
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/data', () => ({ getCurrentInterview: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: () => mockInterview }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/interview-helpers', () => ({
    MediaIcon: () => <span>Media icon</span>,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/utils', () => ({ sanitizeHtml: (html) => html }));

beforeEach(() => {
    useProject.mockReturnValue({ project: { show_preview_img: true } });
    mockInterview = {
        workflow_state: 'public',
        still_url: '/still.jpg',
        media_type: 'video',
        anonymous_title: { en: 'Interview' },
        landing_page_texts: { en: 'Preview text' },
    };
});

test('waits for display settings and hides retained previews on error', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<MediaPreview />);
    expect(useProject).toHaveBeenCalledWith({});
    expect(screen.getByText('Loading')).toBeInTheDocument();
    useProject.mockReturnValue({
        project: { show_preview_img: true },
        error: { message: 'Access denied' },
    });
    rerender(<MediaPreview />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('shows public stills when enabled and falls back to an icon after image failure', () => {
    render(<MediaPreview />);
    expect(screen.getByRole('heading')).toHaveTextContent('Interview');
    expect(screen.getByText('Preview text')).toBeInTheDocument();
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Media icon')).toBeInTheDocument();
});

test('respects the preview setting and interview publication state', () => {
    useProject.mockReturnValue({ project: { show_preview_img: false } });
    const { rerender } = render(<MediaPreview />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    useProject.mockReturnValue({ project: { show_preview_img: true } });
    mockInterview = { ...mockInterview, workflow_state: 'restricted' };
    rerender(<MediaPreview />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    mockInterview = { ...mockInterview, workflow_state: 'unshared' };
    rerender(<MediaPreview />);
    expect(screen.getByText('unauthorized')).toBeInTheDocument();
    expect(screen.queryByText('Preview text')).not.toBeInTheDocument();
});
