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
