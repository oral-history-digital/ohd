import { render, screen } from '@testing-library/react';

import useArchiveSearch from '../useArchiveSearch';
import ArchiveSearch from './ArchiveSearch';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';

jest.mock('../useArchiveSearch', () => jest.fn());
jest.mock('modules/auth', () => ({ AuthShowContainer: () => null }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('react-intersection-observer', () => 'mock-observer');
jest.mock('./ArchiveSearchTabsContainer', () => jest.fn());
jest.mock('./ArchiveSearchSorting', () => () => null);
jest.mock('./SearchActions', () => () => null);

beforeEach(() => {
    ArchiveSearchTabsContainer.mockImplementation((props) => props.children);
});

it.each([1, 3])(
    'does not add a pagination spinner or observer during initial loading (size %s)',
    (size) => {
        useArchiveSearch.mockReturnValue({
            data: undefined,
            isLoading: true,
            size,
        });
        const { container } = render(<ArchiveSearch />);

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(
            container.querySelector('mock-observer')
        ).not.toBeInTheDocument();
    }
);

it('shows the pagination spinner only while an additional page is pending', () => {
    const page = {
        interviews: Array.from({ length: 12 }, (_, id) => ({
            archive_id: `interview-${id}`,
        })),
    };
    useArchiveSearch.mockReturnValue({
        data: [page],
        isLoading: false,
        size: 2,
    });
    const { container, rerender } = render(<ArchiveSearch />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveClass('Spinner--withPadding');
    expect(screen.getByRole('progressbar').parentElement).toHaveClass(
        'u-align-center'
    );
    expect(container.querySelector('mock-observer')).not.toBeInTheDocument();

    useArchiveSearch.mockReturnValue({
        data: [page, page],
        isLoading: false,
        size: 2,
    });
    rerender(<ArchiveSearch />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(container.querySelector('mock-observer')).toBeInTheDocument();
});

it('allows pagination after the first page finishes without showing a bottom spinner', () => {
    const page = {
        interviews: Array.from({ length: 12 }, (_, id) => ({
            archive_id: `interview-${id}`,
        })),
    };
    useArchiveSearch.mockReturnValue({
        data: [page],
        isLoading: false,
        size: 1,
    });
    const { container } = render(<ArchiveSearch />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(container.querySelector('mock-observer')).toBeInTheDocument();
});
