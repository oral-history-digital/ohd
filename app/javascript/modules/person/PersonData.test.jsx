/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectAccessStatus } from 'modules/auth';
import { useProject } from 'modules/routes';

import PersonData from './PersonData';
import { usePersonWithAssociations } from './hooks';

jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/auth', () => ({ useProjectAccessStatus: jest.fn() }));
jest.mock('modules/data', () => ({
    useHumanReadable: () => ({
        humanReadable: ({ obj, attribute }) => obj[attribute],
    }),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/events', () => ({
    EventContentField: ({ label }) => <p>{label}</p>,
}));
jest.mock('modules/forms', () => ({
    ContentField: ({ label, value }) => (
        <p>
            {label}: {value}
        </p>
    ),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./hooks', () => ({ usePersonWithAssociations: jest.fn() }));
jest.mock(
    './Biography',
    () =>
        function Biography() {
            return null;
        }
);
jest.mock(
    './NameOrPseudonym',
    () =>
        function NameOrPseudonym() {
            return null;
        }
);

const fields = [
    {
        id: 1,
        name: 'description',
        source: 'Person',
        label: 'Public description',
        display_on_landing_page: true,
        use_in_details_view: true,
    },
    {
        id: 2,
        name: 'gender',
        source: 'Person',
        label: 'Private field',
        use_in_details_view: true,
    },
    {
        id: 3,
        name: 'birth',
        source: 'EventType',
        eventable_type: 'Person',
        event_type_id: 8,
        label: 'Birth event',
        display_on_landing_page: true,
        use_in_details_view: true,
    },
    {
        id: 4,
        name: 'duration',
        source: 'Interview',
        label: 'Interview field',
        use_in_details_view: true,
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { metadata_fields: fields } });
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: false });
    usePersonWithAssociations.mockReturnValue({
        data: {
            description: 'Visible',
            gender: 'Private value',
            events: [{ event_type_id: 8 }],
        },
    });
});

test('uses localized field and event labels while preserving landing-page and detail visibility', () => {
    const { rerender } = render(
        <PersonData interview={{}} intervieweeId={7} />
    );
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });
    expect(screen.getByText('Public description: Visible')).toBeInTheDocument();
    expect(screen.getByText('Birth event')).toBeInTheDocument();
    expect(screen.queryByText(/Private value/)).not.toBeInTheDocument();

    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: true });
    rerender(<PersonData interview={{}} intervieweeId={7} />);
    expect(
        screen.getByText('Private field: Private value')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Interview field/)).not.toBeInTheDocument();
});

test('shows loading and project or person errors instead of retained metadata', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <PersonData interview={{}} intervieweeId={7} />
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText(/Visible/)).not.toBeInTheDocument();

    useProject.mockReturnValue({ error: { message: 'Project denied' } });
    rerender(<PersonData interview={{}} intervieweeId={7} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Project denied');

    useProject.mockReturnValue({ project: { metadata_fields: fields } });
    usePersonWithAssociations.mockReturnValue({
        error: { message: 'Person denied' },
    });
    rerender(<PersonData interview={{}} intervieweeId={7} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Person denied');
});
