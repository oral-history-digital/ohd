/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { Fetch } from 'modules/data';
import { useProject } from 'modules/routes';

import SegmentContentViewer from './SegmentContentViewer';
import SegmentRegistryReferences from './SegmentRegistryReferences';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/data', () => ({
    Fetch: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/ui/Buttons', () => ({
    CancelButton: ({ handleCancel }) => (
        <button onClick={handleCancel}>Close editor</button>
    ),
}));
jest.mock('modules/utils', () => ({ sanitizeHtml: (html) => html }));
jest.mock('modules/workbook', () => ({
    useWorkbook: () => ({
        savedSegments: [
            {
                id: 1,
                reference_type: 'Segment',
                reference_id: 7,
                description: 'Saved bookmark',
            },
        ],
    }),
}));
jest.mock('.', () => ({ BookmarkSegmentModal: () => <p>Add bookmark</p> }));
jest.mock('../utils', () => ({
    getSegmentAnnotations: jest.requireActual('../utils/getSegmentAnnotations')
        .getSegmentAnnotations,
    getSegmentWorkbookAnnotations: jest.requireActual(
        '../utils/getSegmentWorkbookAnnotations'
    ).getSegmentWorkbookAnnotations,
}));
jest.mock('modules/registry-references', () => ({
    RegistryReferencesContainer: ({ setOpenReference }) => (
        <button
            onClick={() =>
                setOpenReference?.({ notes: { en: 'Reference note' } })
            }
        >
            References
        </button>
    ),
    RegistryReferenceFormContainer: ({ onSubmit, onCancel }) => (
        <div>
            <button onClick={onSubmit}>Save reference</button>
            <button onClick={onCancel}>Cancel reference</button>
        </div>
    ),
}));

const props = {
    segment: {
        id: 7,
        annotations: {
            1: { id: 1, text: { eng: 'English annotation' } },
            2: { id: 2, text: { deu: 'German annotation' } },
        },
    },
    interview: { id: 2 },
    contentLocale: 'eng',
    displayedContentType: 'references',
    onClose: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { root_registry_entry_id: 9 } });
});

test.each([SegmentContentViewer, SegmentRegistryReferences])(
    '%p waits for registry settings and never fetches with a missing root or denied project',
    (Component) => {
        useProject.mockReturnValue({ isLoading: true });
        const { rerender } = render(<Component {...props} />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(Fetch).not.toHaveBeenCalled();
        expect(useProject).toHaveBeenCalledWith({
            include: ['registry_configuration'],
        });
        useProject.mockReturnValue({
            project: { root_registry_entry_id: 9 },
            error: { message: 'Access denied' },
        });
        rerender(<Component {...props} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
        expect(Fetch).not.toHaveBeenCalled();
        useProject.mockReturnValue({
            project: { root_registry_entry_id: null },
        });
        rerender(<Component {...props} />);
        expect(Fetch).not.toHaveBeenCalled();
    }
);

test('loads segment references and root, retaining creation, cancellation, and close callbacks', () => {
    const onCancel = jest.fn();
    render(<SegmentRegistryReferences {...props} onCancel={onCancel} />);
    expect(Fetch.mock.calls.map(([options]) => options.fetchParams)).toEqual([
        [
            'registry_entries',
            null,
            null,
            'ref_object_type=Segment&ref_object_id=7',
        ],
        ['registry_entries', 9],
    ]);
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.segment.references.add' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel reference' }));
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.segment.references.add' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save reference' }));
    expect(
        screen.getByRole('button', { name: 'References' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close editor' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
});

test('keeps reference notes, locale-specific annotations, bookmarks, and close controls', () => {
    const { rerender } = render(<SegmentContentViewer {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'References' }));
    expect(screen.getByText('Reference note')).toBeInTheDocument();
    useProject.mockReturnValue({ isLoading: true });
    rerender(
        <SegmentContentViewer {...props} displayedContentType="annotations" />
    );
    expect(screen.getByText('English annotation')).toBeInTheDocument();
    expect(screen.queryByText('German annotation')).not.toBeInTheDocument();
    expect(useProject).toHaveBeenLastCalledWith({ include: [] });
    rerender(
        <SegmentContentViewer {...props} displayedContentType="bookmarks" />
    );
    expect(screen.getByText('Saved bookmark')).toBeInTheDocument();
    expect(screen.getByText('Add bookmark')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('segment-content-viewer-close'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
});
