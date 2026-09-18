import { render, screen } from '@testing-library/react';
import mockPropTypes from 'prop-types';

import RefTree from './RefTree';

jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/routes', () => ({
    useProject: () => ({
        project: { shortname: 'archive' },
        projectId: 'archive',
    }),
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
