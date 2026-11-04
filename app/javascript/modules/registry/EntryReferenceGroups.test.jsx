/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import EntryReferenceGroups from './EntryReferenceGroups';
import useEntryReferences from './useEntryReferences';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    Disclosure: ({ title, children }) => (
        <section aria-label={title}>{children}</section>
    ),
}));
jest.mock('./useEntryReferences', () => jest.fn());
jest.mock(
    './EntryReferences',
    () =>
        function References({ references, onSubmit }) {
            return references.map(({ archive_id }) => (
                <button key={archive_id} onClick={onSubmit}>
                    {archive_id}
                </button>
            ));
        }
);

const registryEntry = { id: 1 };
const groupedRefs = [
    ['own', [{ archive_id: 'a001' }]],
    ['other', [{ archive_id: 'b001' }, { archive_id: 'b002' }]],
];

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({
        project: { shortname: 'own', is_umbrella: false },
    });
    useEntryReferences.mockReturnValue({ groupedRefs, referenceCount: 3 });
});

test('shows only current-project references and their count, preserving selection callbacks', () => {
    const onSubmit = jest.fn();
    const { rerender } = render(
        <EntryReferenceGroups
            registryEntry={registryEntry}
            onSubmit={onSubmit}
        />
    );
    expect(useProject).toHaveBeenCalledWith();
    expect(useEntryReferences).toHaveBeenCalledWith(registryEntry);
    expect(screen.getByRole('heading')).toHaveTextContent(
        '1 activerecord.models.registry_reference.one'
    );
    expect(screen.queryByText('b001')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'a001' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    useProject.mockReturnValue({
        project: { shortname: 'empty', is_umbrella: false },
    });
    rerender(<EntryReferenceGroups registryEntry={registryEntry} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('shows all project groups and the total reference count for an umbrella', () => {
    useProject.mockReturnValue({
        project: { shortname: 'portal', is_umbrella: true },
    });
    render(<EntryReferenceGroups registryEntry={registryEntry} />);
    expect(screen.getByRole('heading')).toHaveTextContent(
        '3 activerecord.models.registry_reference.other'
    );
    expect(screen.getByRole('region', { name: 'own' })).toHaveTextContent(
        'a001'
    );
    expect(screen.getByRole('region', { name: 'other' })).toHaveTextContent(
        'b001b002'
    );
});

test.each(['project', 'references'])(
    'hides retained references while %s loads and reports its error',
    (source) => {
        const hook = source === 'project' ? useProject : useEntryReferences;
        const retained =
            source === 'project'
                ? { project: { shortname: 'own', is_umbrella: false } }
                : { groupedRefs, referenceCount: 3 };
        hook.mockReturnValue({ ...retained, isLoading: true });
        const { rerender } = render(
            <EntryReferenceGroups registryEntry={registryEntry} />
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        hook.mockReturnValue({
            ...retained,
            error: { message: 'Request failed' },
        });
        rerender(<EntryReferenceGroups registryEntry={registryEntry} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Request failed');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    }
);
