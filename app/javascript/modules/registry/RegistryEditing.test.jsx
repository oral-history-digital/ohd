/* eslint-disable react/prop-types */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { deleteData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';

import MergeRegistryEntriesButton from './MergeRegistryEntriesButton';
import RegistryEntryEditButtons from './RegistryEntryEditButtons';
import RegistryEntryForm from './RegistryEntryForm';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mockDispatch = jest.fn();
jest.mock('modules/data', () => ({
    deleteData: jest.fn(() => ({ type: 'DELETE_ENTRY' })),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => null),
    DeleteItemForm: ({ onSubmit }) => (
        <button onClick={onSubmit}>Confirm deletion</button>
    ),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/ui', () => {
    function AdminMenu({ children }) {
        return <div>{children}</div>;
    }
    AdminMenu.Item = function Item({ label, children }) {
        return <section aria-label={label}>{children(jest.fn())}</section>;
    };
    return { AdminMenu, Modal: ({ children }) => children(jest.fn()) };
});
jest.mock(
    './RegistryEntryFormContainer',
    () =>
        function EntryForm() {
            return null;
        }
);
jest.mock(
    './RegistryHierarchyFormContainer',
    () =>
        function HierarchyForm() {
            return null;
        }
);
jest.mock(
    './RegistryNameFormContainer',
    () =>
        function NameForm() {
            return null;
        }
);
jest.mock(
    './NormDatumFormContainer',
    () =>
        function NormForm() {
            return null;
        }
);
jest.mock(
    './NormDatumFormWrapper',
    () =>
        function NormWrapper() {
            return null;
        }
);

const parent = { id: 1, name: { en: 'Parent' } };
const entry = {
    id: 2,
    name: { en: 'Entry' },
    registry_names: [],
    notes: { en: 'Existing note' },
    has_geo_coords: true,
    parent_registry_hierarchy_ids: { 1: 22 },
};

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/en');
});

test.each([
    ['delete', 'registry_entries', 2],
    ['edit.registry_entry.delete_parent', 'registry_hierarchies', 22],
])(
    'preserves deletion target and request flags for %s',
    (label, resource, id) => {
        render(
            <RegistryEntryEditButtons
                registryEntry={entry}
                parentRegistryEntry={parent}
            />
        );
        fireEvent.click(
            within(screen.getByRole('region', { name: label })).getByText(
                'Confirm deletion'
            )
        );
        expect(deleteData).toHaveBeenCalledWith(
            { pathBase: '/en' },
            resource,
            id,
            null,
            null,
            true
        );
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_ENTRY' });
    }
);

test('preserves existing entry attributes and nested names when saving an edit', () => {
    const submitData = jest.fn();
    const onSubmit = jest.fn();
    render(
        <RegistryEntryForm
            registryEntries={{ 2: entry }}
            normDataProviders={{}}
            registryEntryId={2}
            registryEntryParent={parent}
            submitData={submitData}
            onSubmit={onSubmit}
        />
    );
    const params = {
        registry_entry: {
            notes: { en: 'Edited note' },
            registry_names_attributes: [{ descriptor: 'Edited name' }],
        },
    };
    Form.mock.calls.at(-1)[0].onSubmit(params);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        { registry_entry: { ...entry, ...params.registry_entry } }
    );
    expect(entry.notes.en).toBe('Existing note');
    expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('preserves parent and initial values when creating an entry', () => {
    const submitData = jest.fn();
    render(
        <RegistryEntryForm
            registryEntries={{}}
            normDataProviders={{}}
            registryEntryParent={parent}
            submitData={submitData}
        />
    );
    const form = Form.mock.calls.at(-1)[0];
    expect(form.values).toMatchObject({
        parent_id: 1,
        workflow_state: 'preliminary',
        has_geo_coords: false,
    });
    const params = {
        registry_entry: {
            parent_id: 1,
            registry_names_attributes: [{ descriptor: 'New name' }],
        },
    };
    form.onSubmit(params);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        { registry_entry: { has_geo_coords: false, ...params.registry_entry } }
    );
});

test('preserves hierarchy payloads and save callbacks on project-prefixed routes', () => {
    usePathBase.mockReturnValue('/history/de');
    const submitData = jest.fn();
    const onSubmit = jest.fn();
    render(
        <RegistryHierarchyForm
            descendantRegistryEntry={entry}
            submitData={submitData}
            onSubmit={onSubmit}
        />
    );
    const form = Form.mock.calls.at(-1)[0];
    expect(form.values.descendant_id).toBe(2);
    const params = { registry_hierarchy: { descendant_id: 2, ancestor_id: 3 } };
    form.onSubmit(params);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/history/de' },
        params
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('keeps the minimum selection and existing merge target/payload', () => {
    const submitData = jest.fn();
    const { rerender, container } = render(
        <MergeRegistryEntriesButton
            selectedRegistryEntryIds={[2]}
            submitData={submitData}
        />
    );
    expect(container).toBeEmptyDOMElement();
    const selected = [2, 3, 4];
    rerender(
        <MergeRegistryEntriesButton
            selectedRegistryEntryIds={selected}
            submitData={submitData}
        />
    );
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        { merge_registry_entry: { id: [2], ids: [3, 4] } }
    );
    expect(selected).toEqual([2, 3, 4]);
});
