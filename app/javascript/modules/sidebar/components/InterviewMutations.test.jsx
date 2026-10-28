/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { deleteData, submitData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { MemoryRouter, useLocation } from 'react-router-dom';

import DestroyTranscript from '../../interview-actions/DestroyTranscript';
import DeleteInterviews from './DeleteInterviews';
import UpdateInterviews from './UpdateInterviews';

const mockDispatch = jest.fn();
const mockClose = jest.fn();
let mockAuthorized = true;
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/data', () => ({
    deleteData: jest.fn(() => ({ type: 'DELETE' })),
    submitData: jest.fn(() => ({ type: 'SAVE' })),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockAuthorized ? children : null),
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(mockClose),
}));
jest.mock('modules/forms', () => ({
    DeleteItemForm: jest.requireActual(
        '../../forms/components/forms/DeleteItemForm'
    ).default,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));

/** @returns {React.ReactElement} Current path after deletion navigation. */
function Location() {
    const location = useLocation();
    return <p data-testid="location">{location.pathname}</p>;
}

beforeEach(() => {
    jest.clearAllMocks();
    mockAuthorized = true;
    usePathBase.mockReturnValue('/adg/de');
});

test.each(['/adg/de', '/de'])(
    'deletes selected public interview IDs through %s and leaves the detail page',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        render(
            <MemoryRouter initialEntries={[`${pathBase}/interviews/adg001`]}>
                <DeleteInterviews selectedArchiveIds={['adg001', 'adg002']} />
                <Location />
            </MemoryRouter>
        );
        expect(deleteData).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'delete' }));
        expect(deleteData.mock.calls).toEqual([
            [{ pathBase }, 'interviews', 'adg001'],
            [{ pathBase }, 'interviews', 'adg002'],
        ]);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('location')).toHaveTextContent(
            `${pathBase}/searches/archive`
        );
        expect(mockClose).toHaveBeenCalledTimes(1);
    }
);

test('deletion preserves permission gating, cancellation, and the search results route', () => {
    const { rerender } = render(
        <MemoryRouter initialEntries={['/adg/de/searches/archive']}>
            <DeleteInterviews selectedArchiveIds={['adg001']} />
            <Location />
        </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
    expect(deleteData).not.toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(screen.getByTestId('location')).toHaveTextContent(
        '/adg/de/searches/archive'
    );
    mockAuthorized = false;
    rerender(
        <MemoryRouter>
            <DeleteInterviews selectedArchiveIds={['adg001']} />
        </MemoryRouter>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test.each(['/adg/de', '/de'])(
    'updates each selected interview through %s without changing shared parameters',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const params = { workflow_state: 'public' };
        render(
            <UpdateInterviews
                params={params}
                action="publish"
                selectedArchiveIds={['adg001', 'adg002']}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
        expect(submitData).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'submit' }));
        expect(submitData.mock.calls).toEqual([
            [
                { pathBase },
                { interview: { id: 'adg001', workflow_state: 'public' } },
            ],
            [
                { pathBase },
                { interview: { id: 'adg002', workflow_state: 'public' } },
            ],
        ]);
        expect(params).toEqual({ workflow_state: 'public' });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockClose).toHaveBeenCalledTimes(2);
    }
);

test.each(['/adg/de', '/de'])(
    'deletes only the confirmed transcript language through %s and shows pending state',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        render(
            <DestroyTranscript
                interview={{
                    archive_id: 'adg001',
                    alpha3s_with_transcript: ['ger', 'eng'],
                }}
            />
        );
        fireEvent.click(
            screen.getAllByRole('button', {
                name: 'destroy.delete_transcript',
            })[0]
        );
        expect(deleteData).not.toHaveBeenCalled();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'destroy.really_destroy_transcript',
            })
        );
        expect(deleteData).toHaveBeenCalledWith(
            { pathBase },
            'interviews',
            'adg001',
            'transcripts',
            'ger',
            false,
            false,
            undefined
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', { name: 'destroy.delete_transcript' })
        ).toHaveLength(1);
    }
);
