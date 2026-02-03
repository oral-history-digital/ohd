import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';

import { useFormState } from './useFormState';

Enzyme.configure({ adapter: new Adapter() });

function HookHarness(props) {
    return <InnerHarness {...props} />;
}

function InnerHarness({ initialValues, data, elements, onRender }) {
    const hook = useFormState(initialValues, data, elements);

    React.useEffect(() => {
        onRender(hook);
    }, [hook, onRender]);

    return null;
}

InnerHarness.propTypes = {
    initialValues: PropTypes.object,
    data: PropTypes.object,
    elements: PropTypes.array,
    onRender: PropTypes.func.isRequired,
};

describe('useFormState', () => {
    let wrapper;
    let hook;

    const render = (props) => {
        wrapper = mount(
            <HookHarness
                {...props}
                onRender={(h) => {
                    hook = h;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        hook = null;
    });

    describe('initialization', () => {
        it('initializes with initialValues', () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            expect(hook.values).toEqual({ name: 'Test' });
        });

        it('derives id from data', () => {
            render({
                initialValues: {},
                data: { id: 42 },
                elements: [],
            });

            expect(hook.values.id).toBe(42);
        });

        it('uses archive_id for Interview', () => {
            render({
                initialValues: {},
                data: { type: 'Interview', archive_id: 'A1' },
                elements: [],
            });

            expect(hook.values.id).toBe('A1');
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
                hook.updateField('email', 'a@test.com');
            });
            wrapper.update();

            expect(hook.values).toEqual({
                name: 'Test',
                email: 'a@test.com',
            });

            await act(async () => {
                hook.updateField('email', 'b@test.com');
            });
            wrapper.update();

            expect(hook.values.email).toBe('b@test.com');
        });
    });

    describe('errors + validation', () => {
        const elements = [
            {
                attribute: 'email',
                validate: (v) => typeof v === 'string' && v.includes('@'),
            },
        ];

        it('initially has no errors', () => {
            render({
                initialValues: { email: 'a@test.com' },
                data: null,
                elements,
            });

            expect(hook.errors.email).toBe(false);
            expect(hook.valid()).toBe(true);
        });

        it('fails validation when invalid', async () => {
            render({
                initialValues: { email: 'invalid' },
                data: null,
                elements,
            });

            expect(hook.valid()).toBe(false);
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

            expect(hook.valid()).toBe(true);
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

            expect(hook.valid()).toBe(true);
        });
    });

    describe('touched tracking', () => {
        it('initializes with empty touched object', () => {
            render({
                initialValues: { email: '' },
                data: null,
                elements: [{ attribute: 'email' }],
            });

            expect(hook.touched).toEqual({});
        });

        it('marks a single field as touched', async () => {
            render({
                initialValues: { email: '', name: '' },
                data: null,
                elements: [{ attribute: 'email' }, { attribute: 'name' }],
            });

            await act(async () => {
                hook.touchField('email');
            });
            wrapper.update();

            expect(hook.touched).toEqual({ email: true });
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
                hook.touchField('email');
                hook.touchField('phone');
            });
            wrapper.update();

            expect(hook.touched).toEqual({
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
                hook.touchAllFields();
            });
            wrapper.update();

            expect(hook.touched).toEqual({
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
                hook.touchField('undefined');
            });
            wrapper.update();

            expect(hook.touched).toEqual({});
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
                hook.touchAllFields();
            });
            wrapper.update();

            expect(hook.touched).toEqual({
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
                hook.writeNestedObject({
                    event: { id: 1, name: 'Event' },
                });
            });
            wrapper.update();

            expect(hook.values.events_attributes).toEqual([
                { id: 1, name: 'Event' },
            ]);
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
                hook.writeNestedObject({
                    event: { id: 1, name: 'New' },
                });
            });
            wrapper.update();

            expect(hook.values.events_attributes).toEqual([
                { id: 1, name: 'New' },
            ]);
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
                hook.deleteNestedObject(0, 'event');
            });
            wrapper.update();

            expect(hook.values.events_attributes).toEqual([{ id: 2 }]);
        });

        it('returns empty array when scope missing', () => {
            render({
                initialValues: {},
                data: null,
                elements: [],
            });

            expect(hook.getNestedObjects('event')).toEqual([]);
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
                hook.updateField('email', 'a@test.com');
                hook.handleErrors('email', false);
            });
            wrapper.update();

            expect(hook.values.email).toBe('a@test.com');
            expect(hook.errors.email).toBe(false);
            expect(hook.valid()).toBe(true);
        });
    });

    describe('isDirty and dirtyFields', () => {
        it('returns false when form is pristine', () => {
            render({
                initialValues: { name: 'Test', email: 'test@example.com' },
                data: null,
                elements: [],
            });

            expect(hook.isDirty).toBe(false);
            expect(hook.dirtyFields).toEqual([]);
        });

        it('returns true and lists changed field when value changes', async () => {
            render({
                initialValues: { name: 'Test', email: 'test@example.com' },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('name', 'New Name');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toEqual(['name']);
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
                hook.updateField('name', 'New Name');
                hook.updateField('age', 30);
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toContain('name');
            expect(hook.dirtyFields).toContain('age');
            expect(hook.dirtyFields.length).toBe(2);
        });

        it('returns false when value is changed back to initial', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('name', 'New Name');
            });
            wrapper.update();
            expect(hook.isDirty).toBe(true);

            await act(async () => {
                hook.updateField('name', 'Test');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(false);
            expect(hook.dirtyFields).toEqual([]);
        });

        it('tracks added fields as dirty', async () => {
            render({
                initialValues: { name: 'Test' },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('email', 'new@example.com');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toContain('email');
        });

        it('ignores id field in dirty check', async () => {
            render({
                initialValues: {},
                data: { id: 42 },
                elements: [],
            });

            await act(async () => {
                hook.updateField('id', 99);
            });
            wrapper.update();

            expect(hook.isDirty).toBe(false);
            expect(hook.dirtyFields).toEqual([]);
        });

        it('ignores nested _attributes in dirty check', async () => {
            render({
                initialValues: {
                    name: 'Test',
                    events_attributes: [{ id: 1 }],
                },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.writeNestedObject({ event: { id: 1, title: 'Updated' } });
            });
            wrapper.update();

            // Should not track _attributes in dirtyFields
            expect(hook.dirtyFields).not.toContain('events_attributes');
        });

        it('handles empty initial values', async () => {
            render({
                initialValues: {},
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('name', 'Test');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toEqual(['name']);
        });

        it('handles undefined values correctly', async () => {
            render({
                initialValues: { name: undefined },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('name', 'Test');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toEqual(['name']);
        });

        it('handles null values correctly', async () => {
            render({
                initialValues: { name: null },
                data: null,
                elements: [],
            });

            await act(async () => {
                hook.updateField('name', 'Test');
            });
            wrapper.update();

            expect(hook.isDirty).toBe(true);
            expect(hook.dirtyFields).toEqual(['name']);
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
                hook.replaceNestedFormValues('events_attributes', [
                    { id: 3 },
                    { id: 4 },
                ]);
            });
            wrapper.update();

            expect(hook.values).toEqual({
                name: 'Test',
                events_attributes: [{ id: 3 }, { id: 4 }],
                contributions_attributes: [{ id: 10 }],
            });
        });
    });
});
