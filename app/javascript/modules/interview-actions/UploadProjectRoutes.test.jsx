/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { Form } from 'modules/forms';

import PhotoForm from '../gallery/PhotoForm';
import ContributionForm from '../interview-metadata/ContributionForm';
import UploadEditTable from './UploadEditTable';
import UploadTranscript from './UploadTranscript';

const mockInvalidate = jest.fn();
jest.mock('modules/person', () => ({
    usePeople: () => ({ data: {} }),
    useInvalidateAllPersonData: () => mockInvalidate,
    useInvalidateInterviewContributors: () => mockInvalidate,
    PersonForm: () => null,
}));
jest.mock('modules/ui', () => ({ Modal: () => null }));
jest.mock('modules/spinners', () => ({ Spinner: () => null }));

jest.mock('modules/routes', () => ({ usePathBase: () => '/adg/de' }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Upload form</p>),
    validateTapeNumber: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test.each([UploadTranscript, UploadEditTable])(
    'upload preserves public identifiers, file validation, and queued-work feedback (%p)',
    (Component) => {
        const submitData = jest.fn();
        render(
            <Component
                archiveId="adg001"
                interview={{ contributions: {} }}
                languages={{}}
                submitData={submitData}
            />
        );
        const form = Form.mock.lastCall[0];
        expect(form.values.archive_id).toBe('adg001');
        const fileField = form.elements.find(
            (field) => field.attribute === 'data'
        );
        expect(fileField.validate(new File(['data'], 'transcript.csv'))).toBe(
            true
        );
        expect(fileField.validate('file')).toBe(false);
        const params = { [form.scope]: { archive_id: 'adg001', data: 'file' } };
        act(() => form.onSubmit(params));
        expect(submitData).toHaveBeenCalledWith(
            { pathBase: '/adg/de' },
            params
        );
        expect(screen.getByText('edit.upload.processing')).toBeInTheDocument();
        expect(screen.queryByText('Upload form')).not.toBeInTheDocument();
    }
);

test('transcript uploads show timecode options for spreadsheets', () => {
    render(
        <UploadTranscript
            archiveId="adg001"
            interview={{
                contributions: {
                    7: {
                        id: 7,
                        contribution_type: 'interviewee',
                        person_id: 9,
                        speaker_designation: 'IP',
                    },
                },
            }}
            languages={{}}
            submitData={jest.fn()}
        />
    );

    expect(Form.mock.lastCall[0].values.contributions_attributes).toEqual([
        { id: 7, person_id: 9, speaker_designation: 'IP' },
    ]);

    const fields = () => Form.mock.lastCall[0].elements;
    const field = (attribute) =>
        fields().find((element) => element.attribute === attribute);
    expect(field('timecode_frame_rate').hidden).toBe(true);

    const selectFile = (name) => {
        act(() =>
            field('data').handlechangecallback('data', new File(['data'], name))
        );
    };
    selectFile('transcript.CSV');
    expect(field('use_frame_timecodes').hidden).toBe(false);
    expect(field('timecode_frame_rate').hidden).toBe(true);
    act(() =>
        field('use_frame_timecodes').handlechangecallback(
            'use_frame_timecodes',
            true
        )
    );
    expect(field('timecode_frame_rate').hidden).toBe(false);
    expect(field('timecode_frame_rate').elementType).toBe('select');
    expect(field('timecode_frame_rate').validate('')).toBe(false);
    expect(
        field('timecode_frame_rate').values.map(({ value }) => value)
    ).toEqual(['24', '25', '30', '50', '60']);
    expect(field('trim_timecodes').hidden).toBe(false);

    selectFile('transcript.vtt');
    expect(field('use_frame_timecodes').hidden).toBe(true);
    expect(field('timecode_frame_rate').hidden).toBe(true);
    expect(field('trim_timecodes').hidden).toBe(true);
});

test.each([true, false])(
    'transcript uploads include a selected rate only in frame mode (%p)',
    (useFrames) => {
        const submitData = jest.fn();
        render(
            <UploadTranscript
                archiveId="adg001"
                interview={{ contributions: {} }}
                languages={{}}
                submitData={submitData}
            />
        );
        const file = new File(['data'], 'transcript.csv');
        act(() =>
            Form.mock.lastCall[0].elements
                .find(({ attribute }) => attribute === 'data')
                .handlechangecallback('data', file)
        );
        act(() =>
            Form.mock.lastCall[0].onSubmit({
                transcript: {
                    data: file,
                    use_frame_timecodes: useFrames,
                    timecode_frame_rate: '25',
                },
            })
        );
        expect(submitData).toHaveBeenCalledWith(
            { pathBase: '/adg/de' },
            {
                transcript: {
                    data: file,
                    ...(useFrames && { timecode_frame_rate: '25' }),
                },
            }
        );
    }
);

test('photo editing preserves translated fields, nested interview ID, upload validation, and completion callback', () => {
    const submitData = jest.fn();
    const onSubmit = jest.fn();
    render(
        <PhotoForm
            interview={{ id: 7 }}
            withUpload
            submitData={submitData}
            onSubmit={onSubmit}
        />
    );
    const form = Form.mock.lastCall[0];
    expect(form.values.interview_id).toBe(7);
    expect(
        form.elements.find((field) => field.attribute === 'caption').multiLocale
    ).toBe(true);
    const upload = form.elements.find((field) => field.attribute === 'data');
    expect(upload.validate(new File(['image'], 'photo.png'))).toBe(true);
    const params = { photo: { interview_id: 7 } };
    act(() => form.onSubmit(params));
    expect(submitData).toHaveBeenCalledWith({ pathBase: '/adg/de' }, params);
    expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('contributor saves retain the nested index and refresh person caches after completion', async () => {
    const submitData = jest.fn();
    const onSubmit = jest.fn();
    render(
        <ContributionForm
            locale="de"
            index={2}
            nested
            contributionTypes={{}}
            submitData={submitData}
            onSubmit={onSubmit}
        />
    );
    act(() =>
        Form.mock.lastCall[0].onSubmit({ contribution: { person_id: 7 } })
    );
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/de' },
        { contribution: { person_id: 7 } },
        2,
        expect.any(Function)
    );
    expect(mockInvalidate).not.toHaveBeenCalled();
    await act(async () => {
        await submitData.mock.calls[0][3]();
    });
    expect(mockInvalidate).toHaveBeenCalledTimes(2);
    expect(onSubmit).toHaveBeenCalledTimes(1);
});
