/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { setArchiveId } from 'modules/archive';
import { useProjectDetail } from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getIsLoggedIn } from 'modules/user';

import EntryReferences from './EntryReferences';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(),
}));
jest.mock('modules/data', () => ({ useProjectDetail: jest.fn() }));
jest.mock('modules/user', () => ({ getIsLoggedIn: jest.fn() }));
jest.mock('modules/archive', () => ({
    setArchiveId: jest.fn((id) => ({ type: 'select', id })),
}));
jest.mock('modules/media-player', () => ({
    sendTimeChangeRequest: jest.fn((tape, time) => ({
        type: 'seek',
        tape,
        time,
    })),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/interview-helpers', () => ({
    TapeAndTime: ({ tape, time }) => (
        <span>
            {tape}:{time}
        </span>
    ),
}));
jest.mock('modules/routes', () => ({
    LinkOrA: ({ project, to, params, onLinkClick, children }) =>
        project ? (
            <a
                href={`/${project.shortname}/en/${to}${params ? `?${params}` : ''}`}
                onClick={onLinkClick}
            >
                {children}
            </a>
        ) : (
            <span>{children}</span>
        ),
}));

const segments = [
    {
        id: 1,
        archive_id: 'a001',
        tape_nbr: 2,
        time: 20,
        transcript_coupled: true,
    },
    {
        id: 2,
        archive_id: 'a001',
        tape_nbr: 1,
        time: 60,
        transcript_coupled: false,
    },
    {
        id: 3,
        archive_id: 'a001',
        tape_nbr: 1,
        time: 10,
        transcript_coupled: true,
    },
];
const references = [
    {
        archive_id: 'a001',
        project_id: 7,
        display_name: 'Alice',
        segment_references: segments,
    },
    {
        archive_id: 'b001',
        project_id: 8,
        display_name: 'Bob',
        segment_references: [],
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    getIsLoggedIn.mockReturnValue(true);
    useProjectDetail.mockImplementation((id) => ({
        project: { id, shortname: `project${id}` },
    }));
});

test('uses each interview project for links and sorts segments by tape and time without changing input data', () => {
    render(<EntryReferences references={references} />);
    expect(useProjectDetail).toHaveBeenCalledTimes(2);
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(useProjectDetail).toHaveBeenCalledWith(8);
    expect(
        screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    ).toEqual([
        '/project7/en/interviews/a001',
        '/project7/en/interviews/a001?tape=1&time=0h00m10s',
        '/project7/en/interviews/a001?tape=1&time=0h01m00s',
        '/project7/en/interviews/a001?tape=2&time=0h00m20s',
        '/project8/en/interviews/b001',
    ]);
    expect(segments.map(({ id }) => id)).toEqual([1, 2, 3]);
    fireEvent.click(screen.getByRole('link', { name: /Bob/ }));
    expect(setArchiveId).toHaveBeenCalledWith('b001');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'select', id: 'b001' });
});

test('only signed-in users see segment references', () => {
    getIsLoggedIn.mockReturnValue(false);
    render(<EntryReferences references={references} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByText('1:10')).not.toBeInTheDocument();
});

test('keeps unavailable references readable and enables links when project details arrive', () => {
    useProjectDetail.mockReturnValue({ project: undefined });
    const { rerender } = render(<EntryReferences references={references} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    useProjectDetail.mockImplementation((id) => ({
        project: id === 7 ? { id, shortname: 'project7' } : undefined,
    }));
    rerender(<EntryReferences references={references} />);
    expect(screen.getByRole('link', { name: /Alice/ })).toHaveAttribute(
        'href',
        '/project7/en/interviews/a001'
    );
    expect(screen.queryByRole('link', { name: /Bob/ })).not.toBeInTheDocument();
});

test('segment selection seeks only coupled transcripts and calls the completion handler', () => {
    const onSubmit = jest.fn();
    render(<EntryReferences references={references} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('link', { name: '1:10' }));
    expect(setArchiveId).toHaveBeenCalledWith('a001');
    expect(sendTimeChangeRequest).toHaveBeenCalledWith(1, 10);
    expect(mockDispatch).toHaveBeenCalledWith({
        type: 'seek',
        tape: 1,
        time: 10,
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);

    sendTimeChangeRequest.mockClear();
    fireEvent.click(screen.getByRole('link', { name: '1:60' }));
    expect(sendTimeChangeRequest).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(2);
});
