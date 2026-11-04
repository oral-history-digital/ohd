import { render, screen } from '@testing-library/react';
import { useGetProject } from 'modules/data';

import ProjectHome from './ProjectHome';

jest.mock('modules/analytics', () => ({ useTrackPageView: jest.fn() }));
jest.mock('modules/data', () => ({ useGetProject: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: 'en' }) }));
jest.mock('modules/routes', () => ({
    useCurrentPage: () => ({ params: { projectShortname: 'test' } }),
}));
jest.mock('modules/user', () => ({ RedirectOnLogin: () => null }));
jest.mock('modules/user-agent', () => ({ ScrollToTop: 'div' }));
jest.mock('./FeaturedInterviews', () => () => null);
jest.mock('./ProjectLogo', () => () => null);
jest.mock('./StartPageVideo', () => () => null);

it('shows a spinner while loading and replaces it with the homepage when ready', () => {
    useGetProject.mockReturnValue({ loading: true });
    const { rerender } = render(<ProjectHome />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    useGetProject.mockReturnValue({
        loading: false,
        project: { name: 'Test project' },
    });
    rerender(<ProjectHome />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(
        screen.getByRole('heading', { name: 'Test project' })
    ).toBeInTheDocument();
});

it('does not show an endless spinner when the project is unavailable', () => {
    useGetProject.mockReturnValue({ loading: false });
    const { container } = render(<ProjectHome />);

    expect(container).toBeEmptyDOMElement();
});
