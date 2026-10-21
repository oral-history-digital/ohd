/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectIdentity } from 'modules/routes';

import { Fetch } from './Fetch';
import { FetchProjectResource } from './FetchProjectResource';

jest.mock('modules/routes', () => ({ useProjectIdentity: jest.fn() }));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('./Fetch', () => ({ Fetch: jest.fn(({ children }) => children) }));

beforeEach(() => jest.clearAllMocks());

test('waits for identity and uses separate query and readiness keys for each project', () => {
    useProjectIdentity.mockReturnValue({});
    const { rerender } = render(
        <FetchProjectResource resource="contribution_types">
            Editor
        </FetchProjectResource>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(Fetch).not.toHaveBeenCalled();
    for (const id of [7, 9]) {
        useProjectIdentity.mockReturnValue({ projectDbId: id });
        rerender(
            <FetchProjectResource resource="contribution_types">
                Editor
            </FetchProjectResource>
        );
        expect(Fetch.mock.lastCall[0]).toMatchObject({
            fetchParams: [
                'contribution_types',
                null,
                null,
                `for_projects=${id}`,
            ],
            testDataType: 'contribution_types',
            testIdOrDesc: `for_projects_${id}`,
        });
        expect(screen.getByText('Editor')).toBeInTheDocument();
    }
});
