/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { submitDataWithFetch } from 'modules/api';
import { useEventTypes } from 'modules/event-types';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';

import EventForm from '../events/EventForm';
import PersonForm from './PersonForm';

const mockMutatePeople = jest.fn();
const mockMutateDetails = jest.fn();
const mockMutateLandingPage = jest.fn();
jest.mock('modules/api', () => ({ submitDataWithFetch: jest.fn() }));
jest.mock('modules/event-types', () => ({ useEventTypes: jest.fn() }));
jest.mock('modules/events', () => ({
    Event: () => null,
    EventForm: () => null,
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Editing form</p>),
    validateDate: jest.fn(),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./hooks', () => ({
    useMutatePeople: () => mockMutatePeople,
    useMutatePersonWithAssociations: () => mockMutateDetails,
    useMutatePersonLandingPageMetadata: () => mockMutateLandingPage,
}));
jest.mock('modules/person', () => ({
    useMutatePeople: () => mockMutatePeople,
    useMutatePersonWithAssociations: () => mockMutateDetails,
    useMutatePersonLandingPageMetadata: () => mockMutateLandingPage,
}));

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { id: 7 } });
    useEventTypes.mockReturnValue({ data: [{ id: 3 }] });
});

test('person creation waits for project settings and hides editing on access failure', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<PersonForm />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(Form).not.toHaveBeenCalled();
    useProject.mockReturnValue({ project: { id: 7 } });
    rerender(<PersonForm />);
    expect(useProject).toHaveBeenCalledWith({});
    expect(Form.mock.calls.at(-1)[0].values).toEqual({ project_id: 7 });
    useProject.mockReturnValue({
        project: { id: 7 },
        error: { message: 'Access denied' },
    });
    rerender(<PersonForm />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Editing form')).not.toBeInTheDocument();
});

test('person save and nested event deletion keep the list and person caches current', async () => {
    const person = { id: 5, display_name: 'Person' };
    const onSubmit = jest.fn();
    render(<PersonForm data={person} onSubmit={onSubmit} />);
    const form = Form.mock.calls.at(-1)[0];
    const params = { person: { id: 5, first_name: 'Updated' } };
    submitDataWithFetch.mockResolvedValue({
        data: { id: 5, display_name: 'Updated person' },
    });
    await act(async () => {
        await form.onSubmit(params);
    });
    let updated;
    await act(async () => {
        updated = await mockMutatePeople.mock.calls[0][0]({
            data: { 6: { id: 6 } },
        });
    });
    expect(submitDataWithFetch).toHaveBeenCalledWith('/pilot/en', params);
    expect(updated.data).toEqual({
        5: { id: 5, display_name: 'Updated person' },
        6: { id: 6 },
    });
    expect(mockMutateDetails).toHaveBeenCalledWith(5);
    expect(mockMutateLandingPage).toHaveBeenCalledWith(5);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const removeEvent = form.nestedScopeProps[0].onDeleteCallback;
    removeEvent(8);
    const afterDeletion = await mockMutatePeople.mock.calls.at(-1)[0]({
        data: { 5: { events: [{ id: 8 }, { id: 9 }] }, 6: { id: 6 } },
    });
    expect(afterDeletion.data[5].events).toEqual([{ id: 9 }]);
    expect(afterDeletion.data[6]).toEqual({ id: 6 });
    expect(mockMutateDetails).toHaveBeenCalledTimes(2);
    expect(mockMutateLandingPage).toHaveBeenCalledTimes(2);
});

test('event saves preserve the nested index, callbacks, and person-cache refreshes', async () => {
    const submitData = jest.fn();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onSubmitCallback = jest.fn();
    render(
        <EventForm
            personId={5}
            index={3}
            submitData={submitData}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onSubmitCallback={onSubmitCallback}
        />
    );
    const form = Form.mock.calls.at(-1)[0];
    expect(form).toMatchObject({
        nested: true,
        values: { eventable_id: 5 },
        onCancel,
        onSubmitCallback,
    });
    const params = { event: { event_type_id: 3 } };
    form.onSubmit(params);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/pilot/en' },
        params,
        3,
        expect.any(Function)
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const updatedEvent = { id: 8, eventable_id: 5, event_type_id: 3 };
    submitData.mock.calls[0][3](updatedEvent);
    const updated = await mockMutatePeople.mock.calls[0][0]({
        data: { 5: { events: [{ id: 8 }, { id: 9 }] } },
    });
    expect(updated.data[5].events).toEqual([updatedEvent, { id: 9 }]);
    expect(mockMutateDetails).toHaveBeenCalledWith(5);
    expect(mockMutateLandingPage).toHaveBeenCalledWith(5);
});
