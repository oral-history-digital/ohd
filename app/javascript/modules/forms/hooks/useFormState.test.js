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
