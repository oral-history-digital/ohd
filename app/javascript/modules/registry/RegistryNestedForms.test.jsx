/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';

import NormDatumForm from './NormDatumForm';
import RegistryNameForm from './RegistryNameForm';

jest.mock('modules/forms', () => ({
    Form: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock(
    './RegistrySearchResult',
    () =>
        function SearchResult({ result }) {
            return <li>{result.name}</li>;
        }
);

const nameTypes = {
    5: { id: 5, code: 'spelling' },
    6: { id: 6, code: 'ancient' },
};
const nameProps = {
    registryNameTypes: nameTypes,
    setDescriptor: jest.fn(),
    searchRegistryEntry: jest.fn(),
};
const providers = { 8: { id: 8, name: 'Provider' } };

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/en');
});

test.each([
    [
        'name',
        RegistryNameForm,
        nameProps,
        { registry_name: { descriptor: 'Name' } },
    ],
    [
        'authority data',
        NormDatumForm,
        { normDataProviders: providers },
        { norm_datum: { nid: 'ID-7' } },
    ],
])(
    'preserves nested index and callbacks when submitting %s',
    (_, Component, specific, params) => {
        const submitData = jest.fn();
        const onSubmitCallback = jest.fn();
        const onCancel = jest.fn();
        render(
            <Component
                {...specific}
                registryEntryId={2}
                nested
                index={3}
                submitData={submitData}
                onSubmitCallback={onSubmitCallback}
                onCancel={onCancel}
            />
        );
        const form = Form.mock.calls.at(-1)[0];
        expect(form).toMatchObject({
            nested: true,
            onSubmitCallback,
            onCancel,
        });
        expect(form.values.registry_entry_id).toBe(2);
        form.onSubmit(params);
        expect(submitData).toHaveBeenCalledWith({ pathBase: '/en' }, params, 3);
    }
);

test('preserves spelling defaults, descriptor searches, and existing-entry suggestions', () => {
    const { rerender } = render(
        <RegistryNameForm
            {...nameProps}
            submitData={jest.fn()}
            foundRegistryEntries={{
                results: [{ id: 9, name: 'Existing entry' }],
            }}
        />
    );
    const form = Form.mock.calls.at(-1)[0];
    expect(form.values.registry_name_type_id).toBe(5);
    expect(form.values.name_position).toBe(1);
    expect(form.values.translations_attributes).toEqual([]);
    expect(screen.getByText('Existing entry')).toBeInTheDocument();
    const changeDescriptor = form.elements.find(
        ({ attribute }) => attribute === 'descriptor'
    ).handlechangecallback;
    changeDescriptor('descriptor', 'abc');
    expect(nameProps.searchRegistryEntry).not.toHaveBeenCalled();
    changeDescriptor('descriptor', 'Long name');
    expect(nameProps.setDescriptor).toHaveBeenLastCalledWith('Long name');
    expect(nameProps.searchRegistryEntry).toHaveBeenCalledWith(
        '/en/searches/registry_entry',
        { fulltext: 'Long name' }
    );

    rerender(
        <RegistryNameForm
            {...nameProps}
            registryEntryId={2}
            submitData={jest.fn()}
        />
    );
    Form.mock.calls
        .at(-1)[0]
        .elements[1].handlechangecallback('descriptor', 'Edited name');
    expect(nameProps.searchRegistryEntry).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Existing entry')).not.toBeInTheDocument();
});

test('keeps saved authority provider/identifier values and uses project-prefixed routes', () => {
    usePathBase.mockReturnValue('/history/de');
    const submitData = jest.fn();
    const data = {
        id: 4,
        registry_entry_id: 2,
        norm_data_provider_id: 8,
        nid: 'ID-7',
    };
    render(
        <NormDatumForm
            normDataProviders={providers}
            data={data}
            submitData={submitData}
        />
    );
    const form = Form.mock.calls.at(-1)[0];
    expect(form.data).toBe(data);
    expect(form.elements[0]).toMatchObject({ value: 8, values: providers });
    expect(form.elements[1].value).toBe('ID-7');
    const params = { norm_datum: data };
    form.onSubmit(params);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/history/de' },
        params,
        undefined
    );
});
