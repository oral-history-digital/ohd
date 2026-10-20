import { render, screen } from '@testing-library/react';
import { usePathBase } from 'modules/routes';
import mockPropTypes from 'prop-types';

import RefTree from './RefTree';

jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => null }));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('./RefTreeChildren', () => {
    const RefTreeChildrenMock = ({ entries }) => (
        <div>{entries.map((entry) => entry.label).join(', ')}</div>
    );

    RefTreeChildrenMock.displayName = 'RefTreeChildrenMock';
    RefTreeChildrenMock.propTypes = {
        entries: mockPropTypes.arrayOf(
            mockPropTypes.shape({ label: mockPropTypes.string.isRequired })
        ).isRequired,
    };

    return RefTreeChildrenMock;
});

beforeEach(() => {
    usePathBase.mockReturnValue('/project/en');
});

test.each(['/project/en', '/de'])(
    'requests the public interview reference tree using route prefix %s',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const fetchData = jest.fn();
        const { rerender } = render(
            <RefTree
                archiveId="project001"
                refTreeStatus="n/a"
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenCalledWith(
            { pathBase },
            'interviews',
            'project001',
            'ref_tree'
        );
        rerender(
            <RefTree
                archiveId="project001"
                refTreeStatus="fetching"
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenCalledTimes(1);
        rerender(
            <RefTree
                archiveId="project002"
                refTreeStatus="n/a"
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenLastCalledWith(
            { pathBase },
            'interviews',
            'project002',
            'ref_tree'
        );
    }
);

test('renders project and umbrella references from the migrated response', () => {
    render(
        <RefTree
            archiveId="archive001"
            refTreeStatus="fetched"
            fetchData={jest.fn()}
            refTree={{
                project: { children: [{ label: 'Archive reference' }] },
                umbrella: { children: [{ label: 'Shared reference' }] },
            }}
        />
    );

    expect(screen.getByText('Archive reference')).toBeTruthy();
    expect(screen.getByText('Shared reference')).toBeTruthy();
});

test('shows empty state when neither response part has references', () => {
    render(
        <RefTree
            archiveId="archive001"
            refTreeStatus="fetched"
            fetchData={jest.fn()}
            refTree={{ project: null, umbrella: null }}
        />
    );

    expect(screen.getByText('without_ref_tree')).toBeTruthy();
});
