import { render, screen } from '@testing-library/react';
import { fetchData, getStatuses } from 'modules/data';
import { usePathBase } from 'modules/routes';

import Fetch from './Fetch';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(),
}));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'fetch' })),
    getStatuses: jest.fn(),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/pilot/en');
    getStatuses.mockReturnValue({ registry_entries: {} });
});

test.each(['/pilot/en', '/de'])(
    'loads through %s, preserving parameters and waiting for Redux readiness',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const props = { testDataType: 'registry_entries', testIdOrDesc: 7 };
        const { rerender } = render(
            <Fetch
                {...props}
                fetchParams={[
                    'registry_entries',
                    7,
                    null,
                    'with_associations=true',
                ]}
            >
                <p>Ready</p>
            </Fetch>
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(fetchData).toHaveBeenCalledWith(
            { pathBase },
            'registry_entries',
            7,
            null,
            'with_associations=true'
        );
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'fetch' });
        rerender(
            <Fetch
                {...props}
                fetchParams={[
                    'registry_entries',
                    7,
                    null,
                    'with_associations=true',
                ]}
            >
                <p>Ready</p>
            </Fetch>
        );
        expect(fetchData).toHaveBeenCalledTimes(1);
        getStatuses.mockReturnValue({ registry_entries: { 7: 'fetched-123' } });
        rerender(
            <Fetch
                {...props}
                fetchParams={[
                    'registry_entries',
                    7,
                    null,
                    'with_associations=true',
                ]}
            >
                <p>Ready</p>
            </Fetch>
        );
        expect(screen.getByText('Ready')).toBeInTheDocument();
        expect(fetchData).toHaveBeenCalledTimes(1);
    }
);

test('preserves selector readiness, reload checks, and always-visible children on route changes', () => {
    const testSelector = jest.fn(() => false);
    const reloadSelector = jest.fn(() => false);
    const { rerender } = render(
        <Fetch
            fetchParams={['interviews', 'pilot001', 'segments']}
            testSelector={testSelector}
            reloadSelector={reloadSelector}
            alwaysRenderChildren
        >
            <p>Visible</p>
        </Fetch>
    );
    expect(screen.getByText('Visible')).toBeInTheDocument();
    reloadSelector.mockReturnValue(true);
    rerender(
        <Fetch
            fetchParams={['interviews', 'pilot001', 'segments']}
            testSelector={testSelector}
            reloadSelector={reloadSelector}
        />
    );
    expect(fetchData).toHaveBeenCalledTimes(2);
    usePathBase.mockReturnValue('/pilot/de');
    rerender(
        <Fetch
            fetchParams={['interviews', 'pilot001', 'segments']}
            testSelector={testSelector}
            reloadSelector={reloadSelector}
        />
    );
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/pilot/de' },
        'interviews',
        'pilot001',
        'segments',
        undefined
    );
    testSelector.mockReturnValue(true);
    rerender(
        <Fetch
            fetchParams={['interviews', 'pilot001', 'segments']}
            testSelector={testSelector}
        >
            <p>Ready</p>
        </Fetch>
    );
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(fetchData).toHaveBeenCalledTimes(3);
});
