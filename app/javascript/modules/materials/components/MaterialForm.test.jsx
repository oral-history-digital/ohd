/* eslint-disable react/prop-types */
import { act, render } from '@testing-library/react';
import { submitFormDataWithFetch } from 'modules/api';
import { Form } from 'modules/forms';

import MaterialForm from './MaterialForm';

const mockMutate = jest.fn();
jest.mock('modules/api', () => ({ submitFormDataWithFetch: jest.fn() }));
jest.mock('modules/archive', () => ({ getArchiveId: () => 'adg001' }));
jest.mock('modules/data', () => ({ getCurrentInterview: () => ({ id: 7 }) }));
jest.mock('react-redux', () => ({ useSelector: (select) => select({}) }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/adg/de' }));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Material form</p>),
}));
jest.mock('../hooks/useMutateMaterials', () => ({
    __esModule: true,
    default: () => mockMutate,
}));

beforeEach(() => jest.clearAllMocks());

test('material upload uses the route, keeps PDF validation, and merges the saved material into its cache', async () => {
    const onSubmit = jest.fn();
    render(<MaterialForm withUpload onSubmit={onSubmit} />);
    const form = Form.mock.lastCall[0];
    expect(form.oldOnSubmit).toBeUndefined();
    expect(form.values).toEqual({ interview_id: 7, id: undefined });
    const upload = form.elements.find(
        (element) => element.attribute === 'data'
    );
    const file = new File(['PDF'], 'material.pdf', { type: 'application/pdf' });
    expect(upload.accept).toBe('application/pdf');
    expect(upload.validate(file)).toBe(true);
    expect(upload.validate('file.pdf')).toBe(false);
    const params = { material: { interview_id: 7, data: file } };
    submitFormDataWithFetch.mockResolvedValue({
        data: { id: 8, title: { de: 'Material' } },
    });
    await act(async () => {
        await form.onSubmit(params);
    });
    let updated;
    await act(async () => {
        updated = await mockMutate.mock.calls[0][0]({ data: { 9: { id: 9 } } });
    });
    expect(submitFormDataWithFetch).toHaveBeenCalledWith('/adg/de', params);
    expect(updated.data).toEqual({
        8: { id: 8, title: { de: 'Material' } },
        9: { id: 9 },
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(Form.mock.lastCall[0].fetching).toBe(false);
});

test('editing keeps the material ID, translated fields, and cancel callback without requiring a new upload', () => {
    const material = {
        id: 8,
        title: { de: 'Material' },
        workflow_state: 'public',
    };
    const onCancel = jest.fn();
    render(<MaterialForm material={material} onCancel={onCancel} />);
    expect(Form.mock.lastCall[0]).toMatchObject({
        data: material,
        values: { interview_id: 7, id: 8 },
        onCancel,
    });
    expect(
        Form.mock.lastCall[0].elements.map((element) => element.attribute)
    ).toEqual(['title', 'description', 'workflow_state']);
    expect(Form.mock.lastCall[0].elements[0].multiLocale).toBe(true);
});
