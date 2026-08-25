import { act, renderHook } from '@testing-library/react';

import { useFormState } from './useFormState';

jest.mock('modules/i18n');

describe('useFormState', () => {
    let renderedHook;

    // Helper function to render the hook with given props and capture the hook instance
    const render = (props) => {
        renderedHook = renderHook(() =>
            useFormState(
                props.initialValues,
                props.data,
                props.elements,
                props.submitStateOptions
            )
        );
    };

    // Clean up after each test
    afterEach(() => {
        renderedHook = null;
    });

    describe('initialization', () => {
        it('initializes with initialValues', () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            expect(renderedHook.result.current.values).toEqual({
                name: 'Test',
            });
        });

        it('derives id from data', () => {
            render({
                initialValues: {},
                data: { id: 42 },
                elements: [],
            });

            expect(renderedHook.result.current.values.id).toBe(42);
        });

        it('uses archive_id for Interview', () => {
            render({
                initialValues: {},
                data: { type: 'Interview', archive_id: 'A1' },
                elements: [],
            });

            expect(renderedHook.result.current.values.id).toBe('A1');
        });
    });

    describe('updateField', () => {
        it('adds and updates fields', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('email', 'a@test.com');
            });

            expect(renderedHook.result.current.values).toEqual({
                name: 'Test',
                email: 'a@test.com',
            });

            await act(async () => {
                renderedHook.result.current.updateField('email', 'b@test.com');
            });

            expect(renderedHook.result.current.values.email).toBe('b@test.com');
        });
    });

    describe('errors + validation', () => {
        const elements = [
            {
                attribute: 'email',
                validate: (v) => typeof v === 'string' && v.includes('@'),
            },
        ];

        it('uses current edited value for touched-field validation, not stale element fallback', async () => {
            render({
                initialValues: {},
                data: null,
                elements: [
                    {
                        attribute: 'email',
                        value: 'not-an-email',
                        validate: (v) =>
                            typeof v === 'string' && v.includes('@'),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            await act(async () => {
                renderedHook.result.current.updateField(
                    'email',
                    'valid@example.org'
                );
                renderedHook.result.current.touchField('email');
            });

            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: false,
                helpText: null,
            });
        });

        it('keeps explicit empty edited value invalid even when fallback values exist', async () => {
            render({
                initialValues: { title: 'preset title' },
                data: { title: 'persisted title' },
                elements: [
                    {
                        attribute: 'title',
                        value: 'preset title',
                        validate: (v) => Boolean(v),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            await act(async () => {
                renderedHook.result.current.updateField('title', '');
                renderedHook.result.current.touchField('title');
            });

            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: true,
                helpText: 'edit.form.fix_validation_errors',
            });
        });

        it('initially has no errors', () => {
            render({
                initialValues: { email: 'a@test.com' },
                data: null,
                elements,
            });

            expect(renderedHook.result.current.errors.email).toBe(false);
            expect(renderedHook.result.current.valid()).toBe(true);
        });

        it('fails validation when invalid', async () => {
            render({
                initialValues: { email: 'invalid' },
                data: null,
                elements,
            });

            expect(renderedHook.result.current.valid()).toBe(false);
        });

        it('ignores hidden fields', async () => {
            render({
                initialValues: { secret: '' },
                data: null,
                elements: [
                    {
                        attribute: 'secret',
                        validate: () => false,
                        hidden: true,
                    },
                ],
            });

            expect(renderedHook.result.current.valid()).toBe(true);
        });

        it('ignores optional fields', async () => {
            render({
                initialValues: { note: '' },
                data: null,
                elements: [
                    {
                        attribute: 'note',
                        validate: () => false,
                        optional: true,
                    },
                ],
            });

            expect(renderedHook.result.current.valid()).toBe(true);
        });
    });

    describe('touched tracking', () => {
        it('initializes with empty touched object', () => {
            render({
                initialValues: { email: '' },
                data: null,
                elements: [{ attribute: 'email' }],
            });

            expect(renderedHook.result.current.touched).toEqual({});
        });

        it('marks a single field as touched', async () => {
            render({
                initialValues: { email: '', name: '' },
                data: null,
                elements: [{ attribute: 'email' }, { attribute: 'name' }],
            });

            await act(async () => {
                renderedHook.result.current.touchField('email');
            });

            expect(renderedHook.result.current.touched).toEqual({
                email: true,
            });
        });

        it('marks multiple fields as touched individually', async () => {
            render({
                initialValues: { email: '', name: '', phone: '' },
                data: null,
                elements: [
                    { attribute: 'email' },
                    { attribute: 'name' },
                    { attribute: 'phone' },
                ],
            });

            await act(async () => {
                renderedHook.result.current.touchField('email');
                renderedHook.result.current.touchField('phone');
            });

            expect(renderedHook.result.current.touched).toEqual({
                email: true,
                phone: true,
            });
        });

        it('marks all fields as touched', async () => {
            render({
                initialValues: { email: '', name: '', phone: '' },
                data: null,
                elements: [
                    { attribute: 'email' },
                    { attribute: 'name' },
                    { attribute: 'phone' },
                ],
            });

            await act(async () => {
                renderedHook.result.current.touchAllFields();
            });

            expect(renderedHook.result.current.touched).toEqual({
                email: true,
                name: true,
                phone: true,
            });
        });

        it('handles touchField with undefined gracefully', async () => {
            render({
                initialValues: { email: '' },
                data: null,
                elements: [{ attribute: 'email' }],
            });

            await act(async () => {
                renderedHook.result.current.touchField('undefined');
            });

            expect(renderedHook.result.current.touched).toEqual({});
        });

        it('touchAllFields only includes elements with attributes', async () => {
            render({
                initialValues: { email: '', note: '' },
                data: null,
                elements: [
                    { attribute: 'email' },
                    { attribute: 'note' },
                    { elementType: 'extra' }, // no attribute
                ],
            });

            await act(async () => {
                renderedHook.result.current.touchAllFields();
            });

            expect(renderedHook.result.current.touched).toEqual({
                email: true,
                note: true,
            });
        });
    });

    describe('nested objects', () => {
        it('adds a nested object', async () => {
            render({
                initialValues: {},
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.writeNestedObject({
                    event: { id: 1, name: 'Event' },
                });
            });

            expect(
                renderedHook.result.current.values.events_attributes
            ).toEqual([{ id: 1, name: 'Event' }]);
        });

        it('updates nested object by identifier', async () => {
            render({
                initialValues: {
                    events_attributes: [{ id: 1, name: 'Old' }],
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.writeNestedObject({
                    event: { id: 1, name: 'New' },
                });
            });

            expect(
                renderedHook.result.current.values.events_attributes
            ).toEqual([{ id: 1, name: 'New' }]);
        });

        it('deletes nested object by index', async () => {
            render({
                initialValues: {
                    events_attributes: [{ id: 1 }, { id: 2 }],
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.deleteNestedObject(0, 'event');
            });

            expect(
                renderedHook.result.current.values.events_attributes
            ).toEqual([{ id: 2 }]);
        });

        it('returns empty array when scope missing', () => {
            render({
                initialValues: {},
                data: null,
                elements: [],
            });

            expect(
                renderedHook.result.current.getNestedObjects('event')
            ).toEqual([]);
        });
    });

    describe('state stability', () => {
        it('maintains consistency across multiple operations', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [
                    {
                        attribute: 'email',
                        validate: (v) => v?.includes('@'),
                    },
                ],
            });

            await act(async () => {
                renderedHook.result.current.updateField('email', 'a@test.com');
                renderedHook.result.current.handleErrors('email', false);
            });

            expect(renderedHook.result.current.values.email).toBe('a@test.com');
            expect(renderedHook.result.current.errors.email).toBe(false);
            expect(renderedHook.result.current.valid()).toBe(true);
        });
    });

    describe('isDirty and dirtyFields', () => {
        it('returns false when form is pristine', () => {
            render({
                initialValues: { name: 'Test', email: 'test@example.com' },
                data: null,
                elements: [],
            });

            expect(renderedHook.result.current.isDirty).toBe(false);
            expect(renderedHook.result.current.dirtyFields).toEqual([]);
        });

        it('returns true and lists changed field when value changes', async () => {
            render({
                initialValues: { name: 'Test', email: 'test@example.com' },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'New Name');
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toEqual(['name']);
        });

        it('tracks multiple dirty fields', async () => {
            render({
                initialValues: {
                    name: 'Test',
                    email: 'test@example.com',
                    age: 25,
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'New Name');
                renderedHook.result.current.updateField('age', 30);
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toContain('name');
            expect(renderedHook.result.current.dirtyFields).toContain('age');
            expect(renderedHook.result.current.dirtyFields.length).toBe(2);
        });

        it('returns false when value is changed back to initial', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'New Name');
            });
            expect(renderedHook.result.current.isDirty).toBe(true);

            await act(async () => {
                renderedHook.result.current.updateField('name', 'Test');
            });

            expect(renderedHook.result.current.isDirty).toBe(false);
            expect(renderedHook.result.current.dirtyFields).toEqual([]);
        });

        it('tracks added fields as dirty', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField(
                    'email',
                    'new@example.com'
                );
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toContain('email');
        });

        it('ignores id field in dirty check', async () => {
            render({
                initialValues: {},
                data: { id: 42 },
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('id', 99);
            });

            expect(renderedHook.result.current.isDirty).toBe(false);
            expect(renderedHook.result.current.dirtyFields).toEqual([]);
        });

        it('tracks nested _attributes in dirty check', async () => {
            render({
                initialValues: {
                    name: 'Test',
                    events_attributes: [{ id: 1 }],
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.writeNestedObject({
                    event: { id: 1, title: 'Updated' },
                });
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toContain(
                'events_attributes'
            );
        });

        it('handles empty initial values', async () => {
            render({
                initialValues: {},
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'Test');
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toEqual(['name']);
        });

        it('handles undefined values correctly', async () => {
            render({
                initialValues: { name: undefined },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'Test');
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toEqual(['name']);
        });

        it('handles null values correctly', async () => {
            render({
                initialValues: { name: null },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'Test');
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toEqual(['name']);
        });

        it('can mark current values as clean after save', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.updateField('name', 'Saved Name');
            });

            expect(renderedHook.result.current.isDirty).toBe(true);
            expect(renderedHook.result.current.dirtyFields).toEqual(['name']);

            await act(async () => {
                renderedHook.result.current.markCurrentValuesAsClean();
            });

            expect(renderedHook.result.current.isDirty).toBe(false);
            expect(renderedHook.result.current.dirtyFields).toEqual([]);
        });

        it('computes dirty state for next values immediately', () => {
            render({
                initialValues: { name: 'Test', email: 'test@example.com' },
                data: null,
                elements: [],
            });

            const dirtyState =
                renderedHook.result.current.getDirtyStateForValues({
                    ...renderedHook.result.current.values,
                    name: 'T',
                });

            expect(dirtyState.isDirty).toBe(true);
            expect(dirtyState.dirtyFields).toEqual(['name']);
        });
    });

    describe('replaceNestedFormValues', () => {
        it('replaces the specified nested scope without affecting other values', async () => {
            render({
                initialValues: {
                    name: 'Test',
                    events_attributes: [{ id: 1 }, { id: 2 }],
                    contributions_attributes: [{ id: 10 }],
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                renderedHook.result.current.replaceNestedFormValues(
                    'events_attributes',
                    [{ id: 3 }, { id: 4 }]
                );
            });

            expect(renderedHook.result.current.values).toEqual({
                name: 'Test',
                events_attributes: [{ id: 3 }, { id: 4 }],
                contributions_attributes: [{ id: 10 }],
            });
        });
    });

    describe('getSubmitButtonState', () => {
        it('keeps submit enabled for untouched missing required field', () => {
            render({
                initialValues: {
                    title: '',
                },
                data: {},
                elements: [
                    {
                        attribute: 'title',
                        validate: (value) => Boolean(value),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            expect(renderedHook.result.current.hasMissingRequired).toBe(true);
            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: false,
                helpText: null,
            });
        });

        it('shows validation help text for touched missing required field', () => {
            render({
                initialValues: {
                    title: '',
                },
                data: {},
                elements: [
                    {
                        attribute: 'title',
                        validate: (value) => Boolean(value),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            act(() => {
                renderedHook.result.current.touchField('title');
            });

            expect(renderedHook.result.current.hasMissingRequired).toBe(true);
            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: true,
                helpText: 'edit.form.fix_validation_errors',
            });
        });

        it('does not stay disabled from stale touched password confirmation errors', () => {
            let password = 'secret1';

            render({
                initialValues: {
                    password: 'mismatch',
                    password_confirmation: 'mismatch',
                },
                data: {},
                elements: [
                    {
                        attribute: 'password',
                        validate: (value) =>
                            Boolean(value && value.length >= 6),
                    },
                    {
                        attribute: 'password_confirmation',
                        validate: (value) =>
                            Boolean(
                                value && value.length >= 6 && value === password
                            ),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            act(() => {
                renderedHook.result.current.touchField('password_confirmation');
                renderedHook.result.current.handleErrors(
                    'password_confirmation',
                    true
                );
            });

            password = 'mismatch';
            act(() => {
                renderedHook.result.current.touchField('password');
            });

            expect(renderedHook.result.current.hasMissingRequired).toBe(false);
            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: false,
                helpText: null,
            });
        });

        it('returns validation help text when touched field is currently invalid', () => {
            render({
                initialValues: {
                    password: 'secret1',
                    password_confirmation: 'not-matching',
                },
                data: {},
                elements: [
                    {
                        attribute: 'password',
                        validate: (value) =>
                            Boolean(value && value.length >= 6),
                    },
                    {
                        attribute: 'password_confirmation',
                        validate: (value) =>
                            Boolean(
                                value &&
                                    value.length >= 6 &&
                                    value === 'secret1'
                            ),
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            act(() => {
                renderedHook.result.current.touchField('password_confirmation');
            });

            expect(renderedHook.result.current.hasMissingRequired).toBe(false);
            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: true,
                helpText: 'edit.form.fix_validation_errors',
            });
        });

        it('keeps submit enabled for touched valid multi-locale descriptor', () => {
            render({
                initialValues: {
                    translations_attributes: [
                        {
                            descriptor: 'ad',
                            locale: 'de',
                        },
                    ],
                },
                data: {},
                elements: [
                    {
                        attribute: 'descriptor',
                        multiLocale: true,
                        validate: (value) => value && value.length > 1,
                    },
                ],
                submitStateOptions: {
                    fetching: false,
                    hasValidationErrors: false,
                    submitted: false,
                    disableIfUnchanged: false,
                },
            });

            act(() => {
                renderedHook.result.current.touchField('descriptor');
            });

            expect(renderedHook.result.current.submitButtonState).toEqual({
                disabled: false,
                helpText: null,
            });
        });
    });
});
