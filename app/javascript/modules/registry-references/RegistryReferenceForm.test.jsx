import { act, render, screen, waitFor } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';
import { SWRConfig } from 'swr';

import RegistryReferenceForm from './RegistryReferenceForm';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockMutatePerson = jest.fn((id, update) => update());
const mockMutateLanding = jest.fn();
jest.mock('modules/api', () => ({
    fetcher: jest.fn(),
    useRegistryReferenceApi: () => ({
        createRegistryReference: mockCreate,
        updateRegistryReference: mockUpdate,
    }),
}));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => null) }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/en',
}));
jest.mock('modules/person', () => ({
    useMutatePersonWithAssociations: () => mockMutatePerson,
    useMutatePersonLandingPageMetadata: () => mockMutateLanding,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    // eslint-disable-next-line react/prop-types
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

const props = {
    refObject: { id: 7, type: 'Person' },
    interview: { id: 9 },
    registryReferenceTypesStatus: { for_projects_12: 'fetched' },
    registryReferenceTypes: {
        5: { id: 5, use_in_transcript: true },
        6: { id: 6, use_in_transcript: false },
    },
    fetchData: jest.fn(),
    submitData: jest.fn(),
    onSubmit: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { id: 12, is_umbrella: false } });
    fetcher.mockResolvedValue([{ id: 5 }]);
    mockCreate.mockResolvedValue({ data: { id: 7 } });
    mockUpdate.mockResolvedValue({ data: { id: 7 } });
});

test('waits for project settings, handles denial, and loads reference types through the route', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <RegistryReferenceForm {...props} registryReferenceTypesStatus={{}} />
    );
    expect(useProject).toHaveBeenCalledWith();
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(props.fetchData).not.toHaveBeenCalled();
    expect(Form).not.toHaveBeenCalled();
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(
        <RegistryReferenceForm {...props} registryReferenceTypesStatus={{}} />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(props.fetchData).not.toHaveBeenCalled();
    useProject.mockReturnValue({ project: { id: 12 } });
    rerender(
        <RegistryReferenceForm {...props} registryReferenceTypesStatus={{}} />
    );
    expect(props.fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_reference_types',
        null,
        null,
        'for_projects=12'
    );
    rerender(<RegistryReferenceForm {...props} />);
    expect(props.fetchData).toHaveBeenCalledTimes(1);
});

test('chooses umbrella and project trees using the global reference types endpoint', async () => {
    const cache = new Map();
    const { rerender } = render(
        <SWRConfig value={{ provider: () => cache, shouldRetryOnError: false }}>
            <RegistryReferenceForm
                {...props}
                registryReferenceTypeId={5}
                lowestAllowedRegistryEntryId={13}
            />
        </SWRConfig>
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(Form).not.toHaveBeenCalled();
    await waitFor(() => expect(Form).toHaveBeenCalled());
    expect(fetcher).toHaveBeenCalledWith(
        '/en/registry_reference_types/global.json'
    );
    expect(Form.mock.calls.at(-1)[0].elements[0]).toMatchObject({
        loadUmbrellaTree: true,
        lowestAllowedRegistryEntryId: 13,
    });
    rerender(
        <SWRConfig value={{ provider: () => cache }}>
            <RegistryReferenceForm {...props} registryReferenceTypeId={6} />
        </SWRConfig>
    );
    expect(Form.mock.calls.at(-1)[0].elements[0].loadUmbrellaTree).toBe(false);
});

test('reports global reference type failures without rendering the wrong tree', async () => {
    fetcher.mockRejectedValue(new Error('Types unavailable'));
    render(
        <SWRConfig
            value={{ provider: () => new Map(), shouldRetryOnError: false }}
        >
            <RegistryReferenceForm {...props} registryReferenceTypeId={5} />
        </SWRConfig>
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
        'Types unavailable'
    );
    expect(Form).not.toHaveBeenCalled();
});

test('preserves transcript type filtering and creation defaults', () => {
    render(<RegistryReferenceForm {...props} inTranscript />);
    const form = Form.mock.calls.at(-1)[0];
    expect(form.elements[1].values).toEqual([
        { id: 5, use_in_transcript: true },
    ]);
    expect(form.values).toMatchObject({
        ref_object_id: 7,
        ref_object_type: 'Person',
        interview_id: 9,
        registry_reference_type_id: null,
    });
    expect(fetcher).not.toHaveBeenCalled();
});

test.each([false, true])(
    'preserves person mutation refreshes when editing: %s',
    async (editing) => {
        render(
            <RegistryReferenceForm
                {...props}
                refObject={editing ? undefined : props.refObject}
                registryReference={
                    editing
                        ? { id: 4, ref_object_id: 7, ref_object_type: 'Person' }
                        : undefined
                }
            />
        );
        const params = {
            registry_reference: {
                registry_entry_id: 11,
                ...(editing ? { id: 4 } : {}),
            },
        };
        await act(async () => {
            await Form.mock.calls.at(-1)[0].onSubmit(params);
        });
        expect(mockMutatePerson).toHaveBeenCalledWith(7, expect.any(Function));
        const operation = editing ? mockUpdate : mockCreate;
        const args = editing
            ? [4, { registry_entry_id: 11 }]
            : [{ registry_entry_id: 11 }];
        expect(operation).toHaveBeenCalledWith(...args);
        expect(params.registry_reference.id).toBe(editing ? 4 : undefined);
        expect(mockMutateLanding).toHaveBeenCalledWith(7);
        expect(props.onSubmit).toHaveBeenCalled();
        expect(props.submitData).not.toHaveBeenCalled();
    }
);

test('preserves Redux saves and callback for segment references', async () => {
    render(
        <RegistryReferenceForm
            {...props}
            refObject={{ id: 8, type: 'Segment' }}
        />
    );
    const params = { registry_reference: { registry_entry_id: 11 } };
    await act(async () => {
        await Form.mock.calls.at(-1)[0].onSubmit(params);
    });
    expect(props.submitData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        params,
        {},
        props.onSubmit
    );
    expect(mockMutatePerson).not.toHaveBeenCalled();
});
