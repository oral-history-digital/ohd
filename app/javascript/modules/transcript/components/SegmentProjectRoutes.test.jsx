/* eslint-disable react/prop-types */
import { act, render } from '@testing-library/react';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';

import AnnotationForm from '../../annotations/AnnotationForm';
import AnnotationFormContainer from '../../annotations/AnnotationFormContainer';
import SegmentForm from './SegmentForm';

const mockDispatch = jest.fn();
const mockSaveStart = jest.fn();
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
    useSegmentSaveNotification: () => ({ handleSaveStart: mockSaveStart }),
}));
jest.mock('../../annotations/AnnotationForm', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

test('segment saves preserve content locale and completion callback while using the route prefix', () => {
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
    act(() => form.onSubmit(params));
    expect(save).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        params,
        expect.any(Function)
    );
    expect(mockSaveStart).toHaveBeenCalledTimes(1);
    save.mock.calls[0][2]();
    expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('annotation wrapper passes route context and dispatches saves without reading project records', () => {
    render(<AnnotationFormContainer contentLocale="ger" segment={{ id: 3 }} />);
    const props = AnnotationForm.mock.lastCall[0];
    expect(props.pathBase).toBe('/adg/en');
    expect(props.contentLocale).toBe('ger');
    props.submitData(
        { pathBase: props.pathBase },
        { annotation: { text: 'Note' } }
    );
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { annotation: { text: 'Note' } }
    );
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SAVE' });
});
