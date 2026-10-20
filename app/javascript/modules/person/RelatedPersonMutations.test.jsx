/* eslint-disable react/prop-types */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathBase } from 'modules/routes';

import Contribution from '../interview-metadata/Contribution';
import BiographicalEntry from './BiographicalEntry';

let mockAuthorized;
const mockClose = jest.fn();
const mockInvalidateContributors = jest.fn();
const mockInvalidatePeople = jest.fn();
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockAuthorized ? children : null),
    useAuthorization: () => ({ isAuthorized: () => mockAuthorized }),
}));
jest.mock('modules/forms', () => ({
    DeleteItemForm: ({ onSubmit }) => (
        <button onClick={onSubmit}>Confirm deletion</button>
    ),
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(mockClose),
}));
jest.mock('modules/utils', () => ({ sanitizeHtml: (html) => html }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/person', () => ({
    useInvalidateInterviewContributors: () => mockInvalidateContributors,
    useInvalidateAllPersonData: () => mockInvalidatePeople,
}));
jest.mock('@reach/disclosure', () => ({
    Disclosure: ({ children }) => <span>{children}</span>,
    DisclosureButton: ({ children }) => <button>{children}</button>,
    DisclosurePanel: () => null,
}));
jest.mock(
    './BiographicalEntryFormContainer',
    () =>
        function BiographyForm() {
            return null;
        }
);
jest.mock(
    '../interview-metadata/ContributionFormContainer',
    () =>
        function ContributionForm() {
            return null;
        }
);

beforeEach(() => {
    jest.clearAllMocks();
    mockAuthorized = true;
    usePathBase.mockReturnValue('/pilot/en');
});

test.each(['/pilot/en', '/de'])(
    'deletes a nested biography entry through %s without changing its person target',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const deleteData = jest.fn();
        const data = {
            id: 8,
            person_id: 5,
            text: { en: 'Biography' },
            start_date: {},
            end_date: {},
        };
        const { rerender } = render(
            <BiographicalEntry data={data} deleteData={deleteData} />
        );
        mockAuthorized = false;
        rerender(<BiographicalEntry data={data} deleteData={deleteData} />);
        expect(
            screen.queryByRole('button', { name: 'Confirm deletion' })
        ).not.toBeInTheDocument();
        mockAuthorized = true;
        rerender(<BiographicalEntry data={data} deleteData={deleteData} />);
        fireEvent.click(
            screen.getByRole('button', { name: 'Confirm deletion' })
        );
        expect(deleteData).toHaveBeenCalledWith(
            { pathBase },
            'people',
            5,
            'biographical_entries',
            8,
            true
        );
        expect(mockClose).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Biography')).not.toBeInTheDocument();
    }
);

test('contribution deletion preserves interview identifiers, speaker display, and person-cache refreshes', async () => {
    const props = {
        person: { display_name: 'Contributor' },
        contribution: {
            id: 8,
            workflow_state: 'public',
            speaker_designation: 'Speaker',
        },
        archiveId: 'pilot001',
        interview: { id: 2 },
        withSpeakerDesignation: true,
        deleteData: jest.fn(),
        submitData: jest.fn(),
    };
    const { rerender } = render(<Contribution {...props} />);
    expect(screen.getByText(/Speaker/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm deletion' }));
    expect(props.deleteData).toHaveBeenCalledWith(
        { pathBase: '/pilot/en' },
        'interviews',
        'pilot001',
        'contributions',
        8
    );
    await waitFor(() => expect(mockInvalidatePeople).toHaveBeenCalledTimes(1));
    expect(mockInvalidateContributors).toHaveBeenCalledTimes(1);
    mockAuthorized = false;
    rerender(<Contribution {...props} />);
    expect(screen.getByText('Contributor')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
        <Contribution
            {...props}
            contribution={{ ...props.contribution, workflow_state: 'unshared' }}
        />
    );
    expect(screen.queryByText('Contributor')).not.toBeInTheDocument();
});
