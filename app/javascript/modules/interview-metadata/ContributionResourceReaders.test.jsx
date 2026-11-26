/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import { FetchProjectResource } from 'modules/data';

import ContributionForm from './ContributionForm';
import ContributionFormContainer from './ContributionFormContainer';

const mockTypes = { 2: { id: 2, code: 'interviewer' } };
jest.mock('modules/archive', () => ({
    getLocale: () => 'en',
}));
jest.mock('modules/data', () => ({
    FetchProjectResource: jest.fn(({ children }) => children),
    getContributionTypesForCurrentProject: () => mockTypes,
}));
jest.mock('react-redux', () => ({
    useSelector: (select) => select(),
}));
jest.mock('./ContributionForm', () => jest.fn(() => null));

beforeEach(() => jest.clearAllMocks());

test('contributor subforms load their choices without replacing parent save callbacks', () => {
    const save = jest.fn();
    render(<ContributionFormContainer submitData={save} nested />);
    expect(FetchProjectResource.mock.lastCall[0].resource).toBe(
        'contribution_types'
    );
    expect(ContributionForm.mock.lastCall[0]).toMatchObject({
        contributionTypes: mockTypes,
        locale: 'en',
        submitData: save,
        nested: true,
    });
});
