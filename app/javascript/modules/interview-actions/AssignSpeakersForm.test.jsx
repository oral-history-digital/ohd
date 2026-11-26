/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { FetchProjectResource, fetchData, submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePeople } from 'modules/person';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AssignSpeakersForm from './AssignSpeakersForm';

let mockTypesReady;
jest.mock('modules/archive', () => ({
    getArchiveId: (state) => state.archiveId,
}));
jest.mock('modules/data', () => ({
    FetchProjectResource: jest.fn(({ children }) =>
        mockTypesReady ? children : <p>Loading contribution types</p>
    ),
    getContributionTypesForCurrentProject: (state) => state.types,
    getSpeakerDesignationsStatus: (state) => state.statuses,
    fetchData: jest.fn((...args) => ({ type: 'FETCH', args })),
    submitData: jest.fn((...args) => ({ type: 'SAVE', args })),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Speaker form</p>),
}));
jest.mock('modules/person', () => ({ usePeople: jest.fn() }));
jest.mock('modules/interview-metadata', () => ({
    ContributionFormContainer: () => null,
}));
jest.mock('modules/routes', () => ({ usePathBase: () => '/pilot/en' }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p>Loading speakers</p>,
}));

const interview = {
    archive_id: 'pilot001',
    speaker_designations: { 0: 'INT' },
};
const types = { 2: { id: 2, label: { en: 'Interviewer' } } };
const people = { 9: { id: 9, display_name: 'Interview participant' } };

beforeEach(() => {
    jest.clearAllMocks();
    mockTypesReady = true;
    usePeople.mockReturnValue({ data: people, isLoading: false });
});

test('retains the resource boundary and dispatches speaker updates through the current route', () => {
    const state = {
        archiveId: 'pilot001',
        types,
        statuses: { for_interviews_pilot001: 'fetched' },
    };
    const store = createStore(() => state);
    const dispatch = jest.spyOn(store, 'dispatch');
    mockTypesReady = false;
    const { rerender } = render(
        <Provider store={store}>
            <AssignSpeakersForm interview={interview} />
        </Provider>
    );
    expect(screen.getByText('Loading contribution types')).toBeInTheDocument();
    expect(usePeople).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();

    mockTypesReady = true;
    rerender(
        <Provider store={store}>
            <AssignSpeakersForm interview={interview} />
        </Provider>
    );
    expect(FetchProjectResource.mock.lastCall[0].resource).toBe(
        'contribution_types'
    );
    const form = Form.mock.lastCall[0];
    expect(form.values).toEqual({ id: 'pilot001' });
    expect(form.elements[0]).toMatchObject({
        attribute: '[speakers]INT',
        values: Object.values(people),
    });
    const { container: contribution } = render(
        form.nestedScopeProps[0].elementRepresentation({
            person_id: '9',
            contribution_type_id: 2,
            speaker_designation: 'INT',
        })
    );
    expect(contribution).toHaveTextContent(
        'Interview participant, Interviewer, INT'
    );
    const params = {
        update_speaker: { id: 'pilot001', speakers: { INT: '9' } },
    };
    act(() => form.onSubmit(params));
    expect(submitData).toHaveBeenCalledWith({ pathBase: '/pilot/en' }, params);
    expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE',
        args: [{ pathBase: '/pilot/en' }, params],
    });
    expect(screen.queryByText('Speaker form')).not.toBeInTheDocument();
});

test('loads missing designations with the public ID and responds to Redux status updates', () => {
    const initial = { archiveId: 'pilot001', types, statuses: {} };
    const store = createStore((state = initial, action) =>
        action.type === 'LOADED'
            ? { ...state, statuses: { for_interviews_pilot001: 'fetched' } }
            : state
    );
    render(
        <Provider store={store}>
            <AssignSpeakersForm interview={interview} />
        </Provider>
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/pilot/en' },
        'interviews',
        'pilot001',
        'speaker_designations'
    );
    expect(screen.getByText('Loading speakers')).toBeInTheDocument();
    act(() => store.dispatch({ type: 'LOADED' }));
    expect(screen.getByText('Speaker form')).toBeInTheDocument();
    expect(fetchData).toHaveBeenCalledTimes(1);
});
