import { render, screen } from '@testing-library/react';
import { Fetch } from 'modules/data';
import { Spinner } from 'modules/spinners';

import ArchiveSearchTabs from './ArchiveSearchTabs';

jest.mock('modules/data', () => ({ Fetch: jest.fn() }));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => false }),
    AuthorizedContent: () => null,
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/sidebar', () => ({ useSidebar: () => ({}) }));
jest.mock('./ResultGrid', () => () => null);
jest.mock('./ResultTable', () => () => null);
jest.mock('./WorkflowResults', () => () => null);

it('shows only the centered padded metadata spinner while collections load', () => {
    Fetch.mockImplementation((props) =>
        props.testDataType === 'collections' ? props.fallback : props.children
    );

    render(
        <ArchiveSearchTabs
            empty={false}
            loading={false}
            viewModes={['grid']}
            currentViewMode="grid"
            setViewMode={jest.fn()}
        >
            <div data-testid="pagination">
                <Spinner withPadding />
            </div>
        </ArchiveSearchTabs>
    );

    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(screen.getByRole('progressbar')).toHaveClass('Spinner--withPadding');
    expect(screen.getByRole('progressbar').parentElement).toHaveClass(
        'u-align-center'
    );
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
});

it('mounts pagination only after collections are ready', () => {
    Fetch.mockImplementation((props) => props.children);

    render(
        <ArchiveSearchTabs
            empty={false}
            loading={false}
            viewModes={['grid']}
            currentViewMode="grid"
            setViewMode={jest.fn()}
        >
            <div data-testid="pagination">
                <Spinner withPadding />
            </div>
        </ArchiveSearchTabs>
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
});
