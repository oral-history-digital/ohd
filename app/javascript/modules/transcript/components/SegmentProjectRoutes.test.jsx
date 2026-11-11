/* eslint-disable react/prop-types */
import { act, render } from '@testing-library/react';
import { Form } from 'modules/forms';

import SegmentForm from './SegmentForm';

const mockDispatch = jest.fn();
const mockSaveStart = jest.fn();
const mockSaveError = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/data', () => ({
    submitData: jest.fn(() => ({ type: 'SAVE' })),
}));
jest.mock('modules/routes', () => ({ usePathBase: () => '/adg/en' }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => null) }));
jest.mock('modules/person', () => ({
    useInterviewContributors: () => ({ data: {} }),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => null }));
jest.mock('../hooks', () => ({
    useSegmentSaveNotification: () => ({
        handleSaveStart: mockSaveStart,
        handleSaveError: mockSaveError,
    }),
}));

test('segment saves preserve content locale and completion callback while using the route prefix', async () => {
    const save = jest.fn();
    const onSubmit = jest.fn();
    render(
        <SegmentForm
            contentLocale="ger"
            segment={{
                id: 3,
                interview_id: 7,
                timecode: '00:00:01.000',
                text: { ger: 'Original' },
            }}
            submitData={save}
            onSubmit={onSubmit}
            onCancel={jest.fn()}
        />
    );
    const form = Form.mock.lastCall[0];
    const params = { segment: { id: 3, locale: 'ger', text: 'Updated' } };
    let submission;
    act(() => {
        submission = form.onSubmit(params);
    });
    expect(save).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        params,
        expect.any(Function),
        { onError: expect.any(Function) }
    );
    expect(mockSaveStart).toHaveBeenCalledTimes(1);
    const response = { nested_id: 3 };
    save.mock.calls[0][2](response);
    await expect(submission).resolves.toEqual(response);
    expect(form.onSubmitCallback).toBe(onSubmit);
});

test('a rejected segment save forwards the error and keeps the submission failed', async () => {
    const save = jest.fn();
    const onSubmit = jest.fn();
    render(
        <SegmentForm
            contentLocale="ger"
            segment={{
                id: 3,
                timecode: '00:00:01.000',
                text: { ger: 'Original' },
            }}
            submitData={save}
            onSubmit={onSubmit}
        />
    );
    const params = { segment: { id: 3, timecode: '00:00:01' } };
    let submission;
    act(() => {
        submission = Form.mock.lastCall[0].onSubmit(params);
    });
    const message = 'must use HH:MM:SS.mmm';
    const error = { errors: { timecode: [message] } };

    act(() => save.mock.calls[0][3].onError(error));

    await expect(submission).rejects.toEqual(error);
    expect(mockSaveError).toHaveBeenCalledWith(error);
    expect(onSubmit).not.toHaveBeenCalled();
});
