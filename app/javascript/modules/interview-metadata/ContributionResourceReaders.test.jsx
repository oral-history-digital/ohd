/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import { FetchProjectResource } from 'modules/data';

import AssignSpeakersForm from '../interview-actions/AssignSpeakersForm';
import AssignSpeakersFormContainer from '../interview-actions/AssignSpeakersFormContainer';
import ContributionForm from './ContributionForm';
import ContributionFormContainer from './ContributionFormContainer';

const mockTypes = { 2: { id: 2, code: 'interviewer' } };
const mockDispatch = jest.fn();
jest.mock('modules/archive', () => ({
    getLocale: () => 'en',
    getArchiveId: () => 'pilot001',
}));
jest.mock('modules/data', () => ({
    FetchProjectResource: jest.fn(({ children }) => children),
    getContributionTypesForCurrentProject: () => mockTypes,
    getSpeakerDesignationsStatus: () => ({}),
    fetchData: () => ({ type: 'FETCH' }),
    submitData: () => ({ type: 'SAVE' }),
}));
jest.mock('react-redux', () => ({
    useSelector: (select) => select(),
    useDispatch: () => mockDispatch,
}));
jest.mock('./ContributionForm', () => jest.fn(() => null));
jest.mock('../interview-actions/AssignSpeakersForm', () => jest.fn(() => null));

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

test('speaker assignment loads the same choices and retains the existing Redux actions', () => {
    const interview = { id: 3 };
    render(<AssignSpeakersFormContainer interview={interview} />);
    expect(FetchProjectResource.mock.lastCall[0].resource).toBe(
        'contribution_types'
    );
    const props = AssignSpeakersForm.mock.lastCall[0];
    expect(props).toMatchObject({
        contributionTypes: mockTypes,
        archiveId: 'pilot001',
        interview,
    });
    props.fetchData();
    props.submitData();
    expect(mockDispatch.mock.calls).toEqual([
        [{ type: 'FETCH' }],
        [{ type: 'SAVE' }],
    ]);
});
