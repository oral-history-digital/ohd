/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import { useProjectAccessStatus } from 'modules/auth';
import { getGroupedContributions } from 'modules/data';
import { useProject } from 'modules/routes';

import ContributionList from './ContributionList';

jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => false }),
    useProjectAccessStatus: jest.fn(),
}));
jest.mock('modules/data', () => ({
    getGroupedContributions: jest.fn(() => []),
    FetchProjectResource: ({ children }) => children,
}));
jest.mock('modules/person', () => ({
    useInterviewContributors: () => ({ data: {} }),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: (select) => select({}) }));
jest.mock('./ContributionContainer', () => () => null);
jest.mock('./ContributionGroup', () => () => null);

beforeEach(() => jest.clearAllMocks());

test('supplies access from loaded display data and denies detail visibility while that data is unavailable', () => {
    const project = { id: 7, grant_access_without_login: false };
    useProject.mockReturnValue({ project });
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: true });
    const { rerender } = render(<ContributionList interview={{ id: 3 }} />);
    expect(useProjectAccessStatus).toHaveBeenLastCalledWith(project);
    expect(getGroupedContributions).toHaveBeenLastCalledWith({}, true);
    useProject.mockReturnValue({ project, error: { status: 403 } });
    rerender(<ContributionList interview={{ id: 3 }} />);
    expect(getGroupedContributions).toHaveBeenLastCalledWith({}, false);
    useProject.mockReturnValue({ isLoading: true });
    rerender(<ContributionList interview={{ id: 3 }} />);
    expect(getGroupedContributions).toHaveBeenLastCalledWith({}, false);
});
